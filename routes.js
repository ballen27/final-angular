/**
 * Created by andyf on 4/14/2017.
 */
//------------------------------------------//
//------------------ROUTES------------------//
//------------------------------------------//

// Upload Photos

var upload = multer({ storage : storage}).single('userPhoto');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log(file, req.body);
        callback(null, '/img');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});

app.post('/api/photo',function(req,res) {
    console.log("got here", req.body);


    upload(req, res, function(err) {
        if (err) {
            console.log(err);
            return res.end("Error uploading file");
        }
        res.end("File has uploaded");
    });
});


// Define homepage
app.get('/', function(req,res){
    res.sendFile(path.resolve("../index.html"));
});