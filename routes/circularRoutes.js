const express = require("express");
const router = express.Router();
const circularsController = require("./../controllers/circularController");

// TODO Student Side
// router.route('/paper')
// .get()

router
  .route("/:circularId")
  .get(circularsController.getCircular)
  .patch(circularsController.updateCircular)
  .delete(circularsController.deleteCircular);


module.exports = router;
