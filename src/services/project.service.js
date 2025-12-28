const prisma = require("../config/db");

class ProjectService {
  async createProject(name, ownerId) {
    return await prisma.project.create({
      data: {
        name,
        members: {
          create: {
            userId: ownerId,
            role: "OWNER", // The creator is always the owner
          },
        },
      },
    });
  }

  async updateProject(projectId, { name }) {
    return await prisma.project.update({
      where: { id: projectId },
      data: { name }, // We explicitly only take 'name' from the object
    });
  }
  async deleteProject(projectId) {
    // Note: Due to foreign key constraints, you may need to delete members first
    // depending on your Prisma "onDelete" settings.
    return await prisma.project.delete({
      where: { id: projectId },
    });
  }
}

module.exports = new ProjectService();
