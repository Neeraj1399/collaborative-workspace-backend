const projectService = require("../services/project.service");
const { sendSuccess } = require("../utils/response");

exports.create = async (req, res, next) => {
  try {
    const { name } = req.body;
    // req.user.id is attached by the authenticate middleware
    const project = await projectService.createProject(name, req.user.id);

    return sendSuccess(res, project, 201, "Project created successfully");
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { name } = req.body;

    const updatedProject = await projectService.updateProject(projectId, {
      name,
    });

    // Broadcast the update to all users in the project room
    const io = req.app.get("io");
    if (io) {
      io.to(projectId).emit("project_renamed", { projectId, newName: name });
    }

    return sendSuccess(
      res,
      updatedProject,
      200,
      "Project updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    await projectService.deleteProject(projectId);

    // REAL-TIME TRIGGER: Notify others the project is gone
    const io = req.app.get("io");
    if (io) {
      io.to(projectId).emit("project_deleted", { projectId });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
