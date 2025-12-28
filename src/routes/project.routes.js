const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");
const jobController = require("../controllers/job.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

router.use(authenticate);

// 2. Create a project
router.post("/", projectController.create);

// 3. Update project details
router.patch(
  "/:projectId",
  authorize(["OWNER", "COLLABORATOR"]),
  projectController.update // FIXED: matches exports.update
);

// 4. Delete a project
router.delete(
  "/:projectId",
  authorize(["OWNER"]),
  projectController.delete // FIXED: matches exports.delete
);
// 5. Job Execution (Requirement #4)
router.post(
  "/:projectId/run",
  authorize(["OWNER", "COLLABORATOR"]),
  jobController.runCode
);

// 6. Job Status Polling
router.get("/jobs/:jobId", jobController.getJobStatus);

module.exports = router;
