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
            "major_missing_reqs": [{
                    "classes": [{
                        "CRN": "BIOL414",
                        "name": "Evolution"
                    }],
                    "choose": 1
                },
                {
                    "classes": [{
                            "CRN": [
                                "BIOL331",
                                "BIOL332"
                            ],
                            "name": "Herpetology and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL379",
                                "BIOL380"
                            ],
                            "name": "Conservation Biology and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL328",
                                "BIOL329"
                            ],
                            "name": "Invertebrate Zoology and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL383",
                                "BIOL384"
                            ],
                            "name": "Biology of Insects and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL381",
                                "BIOL382"
                            ],
                            "name": "California Wildlife and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL390",
                                "BIOL391"
                            ],
                            "name": "Marine Biology and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL392",
                                "BIOL393"
                            ],
                            "name": "Oceanography and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL326",
                                "BIOL327"
                            ],
                            "name": "Field Botany: Calif Plants and Lab"
                        },
                        {
                            "CRN": "ENVS410",
                            "name": "Environmental Monitoring and Lab"
                        }
                    ],
                    "choose": 1
                },
                {
                    "classes": [{
                            "CRN": [
                                "BIOL320",
                                "BIOL321"
                            ],
                            "name": "Human Physiology and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL324",
                                "BIOL325"
                            ],
                            "name": "Molecular Ecology and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL326",
                                "BIOL327"
                            ],
                            "name": "Field Botany: Calif Plants and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL328",
                                "BIOL329"
                            ],
                            "name": "Invertebrate Zoology and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL331",
                                "BIOL332"
                            ],
                            "name": "Herpetology and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL333",
                                "BIOL334"
                            ],
                            "name": "Endocrinology and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL341",
                                "BIOL342"
                            ],
                            "name": "Medical microbiology and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL346",
                                "BIOL347"
                            ],
                            "name": "General Microbiology and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL355",
                                "BIOL356"
                            ],
                            "name": "Developmental Biology and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL362",
                                "BIOL363"
                            ],
                            "name": "Histology and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL365",
                                "BIOL366"
                            ],
                            "name": "Human Anatomy and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL379",
                                "BIOL380"
                            ],
                            "name": "Conservation Biology (SL) and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL381",
                                "BIOL382"
                            ],
                            "name": "California Wildlife and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL383",
                                "BIOL384"
                            ],
                            "name": "Biology of Insects and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL385",
                                "BIOL386"
                            ],
                            "name": "General Parasitology and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL390",
                                "BIOL391"
                            ],
                            "name": "Marine Biology and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL392",
                                "BIOL393"
                            ],
                            "name": "Oceanography and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL395",
                                "BIOL396"
                            ],
                            "name": "Special Topics in Biology and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL443",
                                "BIOL444"
                            ],
                            "name": "Immunology and Lab"
                        },
                        {
                            "CRN": [
                                "BIOL485",
                                "BIOL486"
                            ],
                            "name": "Molecular Gen &amp; Biotechnolgy and Lab"
                        }
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
                    "classes": [{
                            "CRN": "BIOL490",
                            "name": "Seminar in Biology"
                        },
                        {
                            "attribute": true,
                            "CRN": "BIST",
                            "name": "Course with attribute: BIST"
                        }
                    ],
                    "choose": 1
                },
                {
                    "classes": [{
                            "CRN": "PHYS101",
                            "name": "Introductory Physics I and II"
                        },
                        {
                            "CRN": [
                                "PHYS110",
                                "PHYS210"
                            ],
                            "name": "General Physics I and II"
                        }
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