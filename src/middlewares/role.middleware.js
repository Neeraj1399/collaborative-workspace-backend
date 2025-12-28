const prisma = require("../config/db");
const AppError = require("../utils/appError");

/**
 * @param {Array} allowedRoles - e.g., ['OWNER', 'COLLABORATOR']
 */
module.exports = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;

      // 1. Look up the user's role in this specific project
      const membership = await prisma.projectMember.findUnique({
        where: {
          userId_projectId: { userId, projectId },
        },
      });

      // 2. Check if membership exists
      if (!membership) {
        return next(new AppError("You are not a member of this project.", 403));
      }

      // 3. Check if their role is allowed for this action
      if (!allowedRoles.includes(membership.role)) {
        return next(
          new AppError("Permission denied: Insufficient privileges.", 403)
        );
      }

      // 4. Attach role to request for use in controllers if needed
      req.userRole = membership.role;
      next();
    } catch (error) {
      next(error);
    }
  };
};
