const { getUser, constants } = require("../api_helpers");
import nano from "nano";
export default class DashboardController {
  constructor(request) {
    this.request = request;
    this.user = getUser(request);
    this.nano = new nano(
      /*context.isDev*/ true
        ? "http://localhost:5984/"
        : "http://db.courseselector.com/"
    );
    this.auditDB = this.nano.use("degree_audits");
  }
  async getProgress() {
    const { username } = await this.user;
    try {
      const progress = await this.auditDB.get(username);
      return progress;
    } catch (err) {
      return { ok: false, message: "No Records found" };
    }
  }
  async hasDashboard() {
    const { username } = await this.user;
    try {
      const progress = await this.auditDB.get(username);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: "No Records found" };
    }
  }
}

DashboardController.ROUTES = {
  getProgress: {
    path: "/progress",
    verb: "GET"
  },
  hasDashboard: {
    path: "/has-dashboard",
    verb: "GET"
  }
};
