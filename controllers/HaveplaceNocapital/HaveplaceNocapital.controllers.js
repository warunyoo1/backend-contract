const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const Joi = require("joi");
const { google } = require("googleapis");
const { default: axios } = require("axios");
const req = require("express/lib/request.js");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const {
  HaveplaceNocapital,
  validate,
} = require("../../model/HaveplaceNocapital/HaveplaceNocapital.models");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
    // console.log(file.originalname);
  },
});
const {
  uploadFileCreate,
  deleteFile,
} = require("../../funtions/uploadfilecreate");
const { admin } = require("googleapis/build/src/apis/admin");

exports.create = async (req, res) => {
  try {
    const remaining = req.body.total_sales - req.body.cost;
    const platform = remaining * 0.1;
    const total_funddividends_two = platform * 0.2; // ยอดรวมหลังจากหักเเบ่งปัน  platform  x 20%
    const total_funddividends_eight = platform * 0.8; // ยอดรวมหลังจากหักเเบ่งปัน  platform  x 80%
    const funddividends = {
      fund: total_funddividends_two * 0.075, // 7.5%
      allsale: total_funddividends_two * 0.075, // 7.5%
      employee_bonus: total_funddividends_two * 0.05, // 7.5%
    };
    const total =
      funddividends.fund + funddividends.allsale + funddividends.employee_bonus;
    const total_all =
      total_funddividends_two -
      (funddividends.fund +
        funddividends.allsale +
        funddividends.employee_bonus);
    const newData = {
      ...req.body,
      remaining: remaining,
      platform: platform,
      total_funddividends_two: total_funddividends_two,
      funddividends: {
        ...funddividends,
        total: total,
        total_all: total_all,
      },
      total_funddividends_eight: total_funddividends_eight,
    };
    await new HaveplaceNocapital(newData).save();
    res.status(201).send({ message: "เพิ่มข้อมูลสํญญาสำเร็จ", status: true });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};
