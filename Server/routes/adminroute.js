import express from 'express'
import {addDoctor} from '../Controllers/admincontroller.js'
const adminrouter=express.Router()
adminrouter.post('/add-doctor',addDoctor)
export default adminrouter;