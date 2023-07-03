const express = require("express")
const {getAllRequests,SendRequests,UpdateStatus} = require("../controllers/requests")
const router = express.Router()

router.post("/get-requests",getAllRequests)
router.post("/send-requests",SendRequests)
router.post("/update-status",UpdateStatus)

module.exports = router