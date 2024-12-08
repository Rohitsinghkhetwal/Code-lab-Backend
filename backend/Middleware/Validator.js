import jwt from "jsonwebtoken"

export const Validator = (req, resp) => {
  const token = req.cookies?.jwtToken;

  if(!token) {
    return resp.status(400).json({LoggedIn: false});
  }

  try {

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return resp.status(200).json({LoggedIn: true, user: decodedToken});
  }catch(err) {
    
    return resp.status(401).json({LoggedIn: false})
  }
}