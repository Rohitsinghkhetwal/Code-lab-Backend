import jwt from "jsonwebtoken"

export const Validator = (req, resp) => {
  const token = req.cookies?.jwtToken;
  console.log("this is the token here !@", token);

  if(!token) {
    return resp.status(400).json({LoggedIn: false});
  }

  try {

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return resp.status(200).json({LoggedIn: true, user: decodedToken});
  }catch(err) {
    console.log("sonething went wrong here !");
    return resp.status(401).json({LoggedIn: false})
  }
}