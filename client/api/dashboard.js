const { getUser, constants } = require('../api_helpers')
class DashboardController {
    constructor(request) {
        this.request = request
        this.user = getUser(request)
    }
    async getProgress() {
        return {
    "missing_attributes": [
        "C-C1 Literature",
        "C-D1 Philosophy",
        "C-F AREA F: VISUAL AND PERFORMING ARTS",
        "Service Learning"
    ],
    "major_missing_reqs": [
        {
            "classes": [
                "BIOL414"
            ],
            "choose": 1
        },
        {
            "classes": [
                "BIOL331 & BIOL332",
                "BIOL379 & BIOL380",
                "BIOL328 & BIOL329",
                "BIOL383 & BIOL384",
                "BIOL381 & BIOL382",
                "BIOL390 & BIOL391",
                "BIOL392 & BIOL393",
                "BIOL326 & BIOL327",
                "ENVS410"
            ],
            "choose": 1
        },
        {
            "classes": [
                "BIOL320 & BIOL321",
                "BIOL324 & BIOL325",
                "BIOL326 & BIOL327",
                "BIOL328 & BIOL329",
                "BIOL331 & BIOL332",
                "BIOL333 & BIOL334",
                "BIOL341 & BIOL342",
                "BIOL346 & BIOL347",
                "BIOL355 & BIOL356",
                "BIOL362 & BIOL363",
                "BIOL365 & BIOL366",
                "BIOL379 & BIOL380",
                "BIOL381 & BIOL382",
                "BIOL383 & BIOL384",
                "BIOL385 & BIOL386",
                "BIOL390 & BIOL391",
                "BIOL392 & BIOL393",
                "BIOL395 & BIOL396",
                "BIOL443 & BIOL444",
                "BIOL485 & BIOL486"
            ],
            "choose": 2
        },
        {
            "classes": [
                "4 Credits in BIOL 300:499 or 598 or 599* or ENVS 410*"
            ],
            "choose": 1
        },
        {
            "classes": [
                "BIOL490 | ATTRIBUTE = BIST"
            ],
            "choose": 1
        },
        {
            "classes": [
                "PHYS101",
                "PHYS110 & PHYS210"
            ],
            "choose": 1
        }
    ],
    "minor_missing_reqs": [],
    "minor": false,
    "firstname": "Bensu",
    "lastname": "Tangil",
    "level": "Junior",
    "major": "Biology",
    "total_credits_required": 128,
    "total_credits_applied": 97,
    "major_title": "Major in Biology - BS",
    "core_credits_required": 44,
    "core_credits_applied": 51,
    "major_credits_required": 65,
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