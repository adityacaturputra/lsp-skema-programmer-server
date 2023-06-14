const db = require("../models");
const exportExcel = require("../utils/helpers/exportExcel");
const sum = require("../utils/helpers/sum");
const User = db.User;
const PayrollTransaction = db.PayrollTransaction;
const Op = db.Sequelize.Op;

class UserController {
  // Create and Save a new User
  create = (req, res) => {
    // Validate request
    if (!req.body.name) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    // Create a User
    const user = {
      name: req.body.name,
      position: req.body.position,
      salary: req.body.salary,
      phone: req.body.phone,
      address: req.body.address,
    };

    // Save User in the database
    User.create(user)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
      });
  };

    // Retrieve all Users from the database.
  findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

    User.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      });
  };

  // Find a single User with an id
  findOne = (req, res) => {
    const id = req.params.id;

    User.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find User with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving User with id=" + id
        });
      });
  };

  // Update a User by the id in the request
  update = (req, res) => {
    const id = req.params.id;

    User.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || "Error updating User with id=" + id
        });
      });
  };

  // Delete a User with the specified id in the request
  delete = (req, res) => {
    const id = req.params.id;

    User.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete User with id=${id}. Maybe User was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete User with id=" + id
        });
      });
  };

  // Delete all Users from the database.
  deleteAll = (req, res) => {
    User.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} Users were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all users."
        });
      });
  };

  generatePayrollReport = async(req, res) => {
    try {
      const { month_count } = req.query
      const users = await User.findAll();

      const reportsTransaction = users.map(user => {
        const bonus = +user.salary * (
          user?.position?.toLowerCase()?.includes('manager') ? 1/2 :
          user?.position?.toLowerCase()?.includes('supervisor') ? 4/10 :
          user?.position?.toLowerCase()?.includes('staff') ? 3/10 : 0
        );

        const pph = +user.salary * 5/100;
        
        return {
          user_id: user.id,
          generated_at: new Date(),
          salary: user.salary,
          bonus,
          pph,
          total: (+user.salary + bonus - pph) * ( month_count || 1 ),
          month_count,
        }
      })
  
      const sumAllSalaries = sum(reportsTransaction.map(e => e.salary))
      const sumAllBonus = sum(reportsTransaction.map(e => e.bonus))
      const sumAllPph = sum(reportsTransaction.map(e => e.pph))
      const sumAlltotal = sum(reportsTransaction.map(e => e.total))
  
      await PayrollTransaction.bulkCreate(reportsTransaction);
  
      reportsTransaction.push({
        user_id: 'Total: ',
        generated_at: '',
        salary: sumAllSalaries,
        bonus: sumAllBonus,
        pph: sumAllPph,
        total: sumAlltotal
      })
  
      reportsTransaction.forEach(report => {
        delete report.generated_at;
      });
  
      
      const buffer = exportExcel(reportsTransaction, "sheet");
  
      res.writeHead(200, 
        [
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ],
      );
      return res.end(Buffer.from(buffer, "base64"));  
    } catch (err) {
      console.log(err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    }
  };
}

module.exports = new UserController()