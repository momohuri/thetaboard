import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { later } from '@ember/runloop';

export default class GuardianService extends Service {
  constructor(...args) {
    super(...args);
    this.guardianStatus = {};
    this.guardianLogs = {};
    this.guardianSummary = {};
    this.guardianLatestSnapshot = {};
    this.statusAutoRefresh = true;
    this.logsAutoRefresh = false;
    this.latestSnapshotLogs = '';
    this.autoRefreshStatus();
    this.autoRefreshLogs();
    this.statusInterval = 60000;
    this.statusLaterCall = null;
    this.logsLaterCall = null;
  }

  @tracked guardianStatus = {};
  @tracked guardianLogs = {};
  @tracked guardianSummary = {};
  @tracked guardianLatestSnapshot = {};
  @tracked statusAutoRefresh = true;
  @tracked logsAutoRefresh = false;
  @tracked latestSnapshotLogs = '';

  get thetaSdk() {
    return getOwner(this).lookup('service:theta-sdk');
  }

  get guardianStatus() {
    return this.guardianStatus;
  }

  get guardianLogs() {
    return this.guardianLogs;
  }

  get guardianSummary() {
    return this.guardianSummary;
  }

  get guardianLatestSnapshot() {
    return this.guardianLatestSnapshot;
  }

  get guardianLatestSnapshotDate() {
    return this.guardianLatestSnapshot.date;
  }

  get latestSnapshotLogs() {
    return this.latestSnapshotLogs;
  }

  get isError() {
    return this.guardianStatus.status == 'error';
  }

  get isSyncing() {
    return this.guardianStatus.status == 'syncing';
  }

  get isReady() {
    return this.guardianStatus.status == 'ready';
  }

  get isUp() {
    return this.isReady || this.isSyncing;
  }

  get status() {
    if (this.isError) {
      return 'Not running';
    } else if (this.isSyncing) {
      return 'Syncing';
    } else if (this.isReady) {
      return 'Is up';
    }
    return '';
  }

  get messages() {
    let arrMessages = [];
    for (let i in this.guardianStatus.msg)
      arrMessages.push([i + ': ' + this.guardianStatus.msg[i]]);
    return arrMessages;
  }

  get versions() {
    let arrVersions = [];
    for (let i in this.guardianStatus.version){
      if (this.guardianStatus.version.hasOwnProperty(i)) {
        if (this.guardianStatus.version[i]) {
          arrVersions.push(this.guardianStatus.version[i]);
        }
      }
    }
    return arrVersions;
  }

  get snapshotInfo() {
    const yesterday = new Date(new Date().getTime() - 86400000);
    const latestFinalizedBlockTime = this.guardianStatus.msg
      .latest_finalized_block_time
      ? new Date(this.guardianStatus.msg.latest_finalized_block_time * 1000)
      : null;
    return {
      yesterday: yesterday,
      latestFinalizedBlockTime: latestFinalizedBlockTime,
      shouldDownload: yesterday > latestFinalizedBlockTime,
    };
  }

  async updateGuardianLatestSnapshot() {
    const guardianLatestSnapshot = await this.thetaSdk.getGuardianLatestSnapshot();
    this.guardianLatestSnapshot = guardianLatestSnapshot;
  }

  async updateGuardianLatestSnapshotLogs() {
    const latestSnapshotLogs = await this.thetaSdk.downloadLatestGuardianSnapshot();
    this.latestSnapshotLogs = latestSnapshotLogs.logs;
  }

  autoRefreshStatus() {
    if (this.statusAutoRefresh) {
      this.refreshStatus();
      this.statusLaterCall = later(this, function () {
        this.autoRefreshStatus();
      }, this.statusInterval);
    }
  }

  autoRefreshLogs() {
    if (this.logsAutoRefresh) {
      this.refreshLogs();
      this.logsLaterCall = later(this, function () {
        this.autoRefreshLogs();
      }, 5000);
    }
  }

  async refreshLogs() {
    const guardianLogs = await this.thetaSdk.getGuardianLogs();
    this.guardianLogs = guardianLogs;
  }

  async refreshStatus() {
    const guardianStatus = await this.thetaSdk.getGuardianStatus();
    this.guardianStatus = guardianStatus;
  }

  setup(model) {
    this.guardianStatus = model.guardianStatus;
    this.guardianLogs = model.guardianLogs;
    this.guardianSummary = model.guardianSummary;
    this.guardianLatestSnapshot = model.guardianLatestSnapshot;
  }

  @action
  toggleAutoRefreshLogs() {
    this.logsAutoRefresh = !this.logsAutoRefresh;
    if (this.logsAutoRefresh) this.autoRefreshLogs();
  }

  @action
  toggleAutoRefreshStatus() {
    this.statusAutoRefresh = !this.statusAutoRefresh;
    if (this.statusAutoRefresh) this.autoRefreshStatus();
  }

  @action
  async startGuardian() {
    const startGuardian = await this.thetaSdk.startGuardian();
    await this.refreshStatus();
    if (startGuardian.success) {
      $.notify(
        {
          icon: 'glyphicon glyphicon-success-sign',
          title: 'Success!!',
          message: 'Guardian node is starting, check the Guardian Logs for more information.',
        },
        { type: 'success' }
      );
    } else {
      $.notify(
        {
          icon: 'glyphicon glyphicon-success-sign',
          title: 'Error!!',
          message: 'We couldn\'t start your Guardian node, please check the logs for more information.',
        },
        { type: 'error' }
      );
    }
  }

  @action
  async stopGuardian() {
    const stopGuardian = await this.thetaSdk.stopGuardian();
    await this.refreshStatus();
    if (stopGuardian.success) {
      $.notify(
        {
          icon: 'glyphicon glyphicon-success-sign',
          title: 'Success!!',
          message: 'Guardian node successfully stopped',
        },
        { type: 'success' }
      );
    } else {
      $.notify(
        {
          icon: 'glyphicon glyphicon-success-sign',
          title: 'Error!!',
          message: 'We couldn\'t stop your Guardian node, please check the logs for more information.',
        },
        { type: 'error' }
      );
    }
  }

  @action
  clearDownloadLogs() {
    this.latestSnapshotLogs = '';
  }

  @action
  updateGuardian() {
    return '';
  }
}
