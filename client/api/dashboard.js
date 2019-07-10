import { getUser, nanoInstance } from '../api_helpers'
export default class DashboardController {
  constructor (request) {
    this.request = request
    this.user = getUser(request)
    this.nano = nanoInstance
    this.auditDB = this.nano.use('degree_audits')
  }
  async getProgress () {
    const { username } = await this.user
    try {
      const progress = await this.auditDB.get(username)
      return progress
    } catch (err) {
      return { ok: false, message: 'No Records found' }
    }
  }
  async hasDashboard () {
    const { username } = await this.user
    try {
      const progress = await this.auditDB.get(username)
      return { ok: !!progress }
    } catch (err) {
      return { ok: false, message: 'No Records found' }
    }
  }
}

DashboardController.ROUTES = {
  getProgress: {
    path: '/progress',
    verb: 'GET'
  },
  hasDashboard: {
    path: '/has-dashboard',
    verb: 'GET'
  }
}

module.exports = DashboardController
