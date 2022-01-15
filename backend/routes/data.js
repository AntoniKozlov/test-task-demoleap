const express = require('express');
const router = express.Router();
const axios = require('axios').default;

const utils = require('../utils/utils');

router.route('/getData').get(function(req, res) {
    const maxValueGraph = 50, lengthGraph = 12;
    const graphLabelsX = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
    const maxValuePie = 50, lengthPie = 3;
    const pieNamesX = ["Data1", "Data2", "Data3"];

    let arrGraphValues = utils.generateRandomValues(lengthGraph, maxValueGraph);
    let arrPieValues = utils.generateRandomValues(lengthPie, maxValuePie);

    let data = {"bars": {}, "pie": {}};//{"bars": {"Jan.": 13, "Feb.": 22, "Mar.": 23, "Apr.": 38, "May": 45, "Jun.": 39, "Jul.": 42, "Aug.": 47, "Sep.": 34, "Oct.": 17, "Nov.": 28, "Dec.": 12},"pie": {"Data1": 50, "Data2": 35, "Data3": 15}};
    
    data.bars = utils.addRandomValues(data.bars, graphLabelsX, arrGraphValues);
    data.pie = utils.addRandomValues(data.pie, pieNamesX, arrPieValues);
   
    res.status(200).send({data: data})
});

router.route('/getServerData').get(function(req, res) {
    axios(`https://api.demoleap.com/exercise`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        console.log(`Response: ${response.status} ${response.statusText}`);

        res.status(200).send({data: response.data})
      })
      .catch(err => {
        console.log(err);
        res.status(400).send({data: err})
      });
});

module.exports = router;