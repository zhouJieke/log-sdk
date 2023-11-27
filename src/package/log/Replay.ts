import * as rrweb from 'rrweb';
import {uuid} from "./Builder";
import {Activate, ReplayConfig} from "./Interface/Replay.ts";
import Http from "./Http.ts";

class Replay extends Http implements Activate{
  private events: any = []
  private uuid: string = uuid()
  private readonly config: ReplayConfig
  constructor(config: ReplayConfig) {
    super()
    // 加载配置
    this.config = config
    // 启动监听器
    this.startMonitor()
  }
  private startMonitor() {
    rrweb.record({
      emit: (event) => {
        this.events.push(event)
      }
    });
  }
  private reset() {
    this.events = [];
    this.uuid = uuid()
  }
  public run() {
    setInterval(() => {
      this.reportLogs();
      this.reset()
    }, this.config.reportTime || 1000 * 10)
  }
  public reportLogs() {
    // 如果没有日志，则不进行上报
    if (this.events.length <= 0) return;
    console.log(this.uuid, this.events)
    this.httpReportLog(this.uuid, this.events)
  }
}


export default Replay