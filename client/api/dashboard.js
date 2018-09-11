const { getUser, constants } = require('../api_helpers')
class DashboardController {
    constructor(request) {
        this.request = request
        this.user = getUser(request)
    }
    async getProgress() {
        return {
            "missing_attributes": [
                "Foreign Language Requirement",
                "Service Learning"
            ],
            "major_missing_reqs": [{
                "classes": [
                    "CS326"
                ],
                "choose": 1
            }, {
                "classes": [
                    "CS345"
                ],
                "choose": 1
            }],
            "minor_missing_reqs": [],
            "minor": false,
            "firstname": "Nicholas",
            "middlename": "James",
            "lastname": "Perez",
            "level": "Senior",
            "major": "Computer Science (CS)",
            "total_credits_required": 128,
            "total_credits_applied": 134,
            "major_title": "Major in Computer Science (CS) - BS",
            "core_credits_required": 44,
            "core_credits_applied": 58,
            "major_credits_required": 52,
            "major_credits_applied": 44
        }
    }
}

DashboardController.ROUTES = {
    getProgress: {
        path: '/progress',
        verb: 'GET'
    },
}

module.exports = DashboardController