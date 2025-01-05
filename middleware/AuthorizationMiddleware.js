exports.permissions = (...roles) => {
  return (request, response, next) => {
    if (!roles.includes(request.user.role)) {
      return response.status(403).json({
        error: true,
        message: "You are not authorized to access this resource!",
        data: null,
      });
    }

    next();
  };
};
