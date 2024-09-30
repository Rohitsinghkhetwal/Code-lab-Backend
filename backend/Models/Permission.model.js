import mongoose from "mongoose";
import { RoleEnum } from "./User.Model.js";


const PermissionSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Document,
    required: true,
  },
  role: {
    type: String,
    enum: RoleEnum,
    required: true
  }
})

const PermissionModel = mongoose.Model("Permission", PermissionSchema);

export default PermissionModel;