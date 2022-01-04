const express = require("express");
const customerSchema = require("../models/customer");
const storeSchema = require("../models/store");
const orderSchema = require("../models/order");
const employeeSchema = require("../models/employee");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const customer = require("../models/customer");
const router = express.Router();
const signature = "deliveryfood";

// ------------------------------------------------------------------- Admin -------------------------------------------------------------
// Check login admin or store with token
// Token có thời gian hết hạn: 1 ngày
router.post(`/auth/sign-in`, (req, res) => {
  const { email, password, isAdmin } = req.body;
  console.log(req.body);

  if (isAdmin) {
    employeeSchema
      .findOne({
        email: email,
        password: password,
      })
      .then((data) => {
        if (data == null)
          return res.json({ message: "Email or password invalid" });
        else {
          const token = jwt.sign(
            {
              _id: data.id,
              name: data.name,
              email: data.email,
              phone: data.phone,
              role: "admin",
            },
            signature,
            { expiresIn: 86400 }
          );

          return res.json({ token });
        }
      })
      .catch(() => res.json({ message: "Email or password invalid" }));
  } else {
    storeSchema
      .findOne({
        "contact.email": email,
        "contact.password": password,
      })
      .then((data) => {
        if (data == null)
          return res.json({ message: "Email or password invalid" });
        else {
          const token = jwt.sign(
            {
              _id: data.id,
              name: data.name,
              password: data.contact.password,
              email: data.contact.email,
              phone: data.contact.phone,
              street: data.contact.address.street,
              ward: data.contact.address.ward,
              district: data.contact.address.district,
              image: data.image,
              role: "store",
            },
            signature,
            { expiresIn: 86400 }
          );

          res.json({ token });
        }
      })
      .catch(() => res.json({ message: "Email or password invalid" }));
  }
});

// Check token
router.get("/admin/sign-in/:token", (req, res) => {
  try {
    const token = req.params.token;
    const result = jwt.verify(token, signature);
    if (result.role == "admin") {
      employeeSchema.findById(result.id).then((data) => {
        if (data == null) return res.json({ message: false });
        else return res.json({ message: true, data: data });
      });
    } else return res.json({ message: false });
  } catch (error) {
    return res.json({ message: false });
  }
});

router.delete("/auth/log-out", (req, res) => {
  res.json("Done");
});

router.post("/auth/sign-up", (req, res) => {
  console.log(req.body);
  const { isAdmin } = req.body

  if (isAdmin) {
    const employee = employeeSchema(req.body);
    employee
    .save()
    .then((data) => res.json(data))
    .catch((error) => {
      if (error.name === "MongoServerError" && error.code === 11000) {
        res.status(500).json({ message: "Email already exists"});
      } else {
        res.json({ message: error});
      }
    });
  } else {
    const obj = {
      name: req.body.name,
      contact: {
        email: req.body.email,
        password: req.body.password
      }
    }
    const store = storeSchema(obj);
    store
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
  }
});

// ------------------------------------------------------------ Orders ---------------------------------------------------------------
// Get all orders in current date
router.get("/admin/getOrdersCurrentDate", (req, res) => {
  orderSchema
    .find({
      createdAt: { $gte: moment().startOf("date") },
    })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Get all orders in current week
router.get("/admin/getOrdersCurrentWeek", (req, res) => {
  orderSchema
    .find({
      createdAt: {
        $gte: moment().startOf("isoWeek"),
        $lte: moment().endOf("isoWeek"),
      },
    })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Get all orders in current month
router.get("/admin/getOrdersCurrentMonth", (req, res) => {
  orderSchema
    .find({
      createdAt: {
        $gte: moment().startOf("month"),
        $lte: moment().endOf("month"),
      },
    })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Get all orders in current year
router.get("/admin/getOrdersCurrentYear", (req, res) => {
  orderSchema
    .find({
      createdAt: {
        $gte: moment().startOf("year"),
        $lte: moment().endOf("year"),
      },
    })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Get all orders in last week
router.get("/admin/getOrdersLastWeek", (req, res) => {
  orderSchema
    .find({
      createdAt: {
        $gte: moment().startOf("isoWeek").subtract(7, "d"),
        $lt: moment().startOf("isoWeek"),
      },
    })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Get all orders in last month
router.get("/admin/getOrdersLastMonth", (req, res) => {
  orderSchema
    .find({
      createdAt: {
        $gte: moment().startOf("month").subtract(1, "M"),
        $lt: moment().startOf("month"),
      },
    })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Get all orders in last year
router.get("/admin/getOrdersLastYear", (req, res) => {
  orderSchema
    .find({
      createdAt: {
        $gte: moment().startOf("year").subtract(1, "y"),
        $lt: moment().startOf("year"),
      },
    })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// -------------------------------------------------------------- Customers ------------------------------------------------------------
// Get all new customers current date
router.get("/admin/getNewCustomersCurrentDate", (req, res) => {
  customerSchema
    .find({
      createdAt: { $gte: moment().startOf("date") },
    })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Get all new customers current month
router.get("/admin/getNewCustomersCurrentMonth", (req, res) => {
  customerSchema
    .find({
      createdAt: {
        $gte: moment().startOf("month"),
        $lte: moment().endOf("month"),
      },
    })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Get all new customers current year
router.get("/admin/getNewCustomersCurrentYear", (req, res) => {
  customerSchema
    .find({
      createdAt: {
        $gte: moment().startOf("year"),
        $lte: moment().endOf("year"),
      },
    })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Get all new customers last month
router.get("/admin/getNewCustomersLastMonth", (req, res) => {
  customerSchema
    .find({
      createdAt: {
        $gte: moment().startOf("month").subtract(1, "M"),
        $lt: moment().startOf("month"),
      },
    })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Get all new customers last year
router.get("/admin/getNewCustomersLastYear", (req, res) => {
  customerSchema
    .find({
      createdAt: {
        $gte: moment().startOf("year").subtract(1, "y"),
        $lt: moment().startOf("year"),
      },
    })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// -------------------------------------------------------------- Stores --------------------------------------------------------
// Get all new stores current date
router.get("/admin/getNewStoresCurrentDate", (req, res) => {
  storeSchema
    .find({
      createdAt: { $gte: moment().startOf("date") },
    })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Get all new stores current month
router.get("/admin/getNewStoresCurrentMonth", (req, res) => {
  storeSchema
    .find({
      createdAt: {
        $gte: moment().startOf("month"),
        $lt: moment().endOf("month"),
      },
    })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Get all new stores current year
router.get("/admin/getNewStoresCurrentYear", (req, res) => {
  storeSchema
    .find({
      createdAt: {
        $gte: moment().startOf("year"),
        $lte: moment().endOf("year"),
      },
    })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Get all new stores last month
router.get("/admin/getNewStoresLastMonth", (req, res) => {
  storeSchema
    .find({
      createdAt: {
        $gte: moment().startOf("month").subtract(1, "M"),
        $lt: moment().startOf("month"),
      },
    })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Get all new stores last year
router.get("/admin/getNewStoresLastYear", (req, res) => {
  storeSchema
    .find({
      createdAt: {
        $gte: moment().startOf("year").subtract(1, "y"),
        $lt: moment().startOf("year"),
      },
    })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Get revenue by month of the year
router.get("/admin/revenueMonthOfYear", (req, res) => {
  const revenues = [];
  orderSchema
    .find()
    .then((data) => {
      for (let i = 0; i < 12; i++) {
        let sum = 0;
        data.forEach((x) => {
          if (
            x.createdAt >= moment().startOf("year").add(i, "month") &&
            x.createdAt <
              moment()
                .startOf("year")
                .add(i + 1, "month")
          )
            sum += x.total_money;
        });
        revenues.push(sum);
      }
      res.json(revenues);
    })
    .catch((error) => res.json({ message: error }));
});

module.exports = router;
