const upload = require('../middlewares/upload')

const { API_PREFIX } = require('../config')

const mongoose = require('mongoose');
const grid = require('gridfs-stream');
// const conn = mongoose.createConnection(process.env.DB_URL);

// Init gfs
let gfs, gridfsBucket;

(() => {
  mongoose.connection.on("connected", () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
    });
    gfs = grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads');
  });
})();


module.exports = (app) => {

    app.post(`${API_PREFIX}/media/upload`, upload().single("file"), async (req, res) => {
        res.json({ file_data: req.file });
    })

    app.get(`${API_PREFIX}/media/files/:filename`, async (req, res) => {
        try {
            const file = await gfs.files.findOne({ filename: req.params.filename });
            const readStream = gridfsBucket.openDownloadStream(file._id);
            readStream.pipe(res);
        } catch (error) {
            res.json({message: error.message});
        }
    })

}





//   exports.singleFile = async (req, res) => {
//     try {
//         const file = await gfs.files.findOne({ filename: req.params.filename });
//         const readStream = gridfsBucket.openDownloadStream(file._id);
//         readStream.pipe(res);
//     } catch (error) {
//         res.json({message: error.message});
//     }
//   }



// const {uploaded} = require('../controllers/files/uploads')
// const {singleFile} = require('../controllers/files/downloads')


// router.route('/upload').post(upload().single("file"), uploaded)
// router.get('/files/:filename', singleFile)

// module.exports = router;
