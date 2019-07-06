var fs = require('fs');
var applicantObj;

//sort by family name
function fnamesort(a, b) {
    if (a.familyname < b.familyname)
        return -1;
    if (a.familyname > b.familyname)
        return 1;
    return 0;
}

//sort by rank
function ranksort(a, b) {
    if (a.ranking < b.ranking)
        return -1;
    if (a.ranking > b.ranking)
        return 1;
    return 0;
}

console.log("Success:");

//read applicants from tas.json
fs.readFile('tas.json', 'utf-8', function(err, data) {
    if(err) throw err;
    applicantObj = JSON.parse(data);
});

//read courses from tas.json
fs.readFile('courses.json', 'utf-8', function(err, data) {
    if(err) throw err;
    courseObj = JSON.parse(data);
});


//add one applicant
exports.addOne = function(req, res) {
    var stunum = req.body.stunum;
    var givenname = req.body.givenname;
    var familyname = req.body.familyname;
    //let status = $("#select").val();
    //console.log(status);
    var status = req.body.status;
    var year = req.body.year;
    
    //input is empty
    if (stunum == ""||givenname == ""||familyname == ""||status == ""||year == ""){
        console.log("Error: empty field");
        res.send("Error: empty field");
        return false;
    }

    //duplicate student number
    for(i = 0; i < applicantObj['tas'].length; i++) {
        if (stunum == applicantObj['tas'][i]['stunum']){
            console.log("Error");
            res.send("Error: duplicate student number");
            return false;
        }

    }
    var code = req.body.code;
    var rank = req.body.rank;
    var experience = req.body.experience;
    var newApplicant = JSON.parse('{"stunum":"","givenname":"","familyname":"","status":"","year":"","courses": []}');

    newApplicant['stunum']= stunum;
    newApplicant['givenname']= givenname;
    newApplicant['familyname']= familyname;
    newApplicant['status']= status;
    newApplicant['year']= year;
    if (typeof code === 'string' ){
        var course = JSON.parse('{"code":"","rank":"","experience":""}');
        course['code']=code;
        course['rank']=rank;
        course['experience']= experience;
        newApplicant['courses'].push(course);
    }   
    else {
    for (i =0;i< code.length;i++){
        var course = JSON.parse('{"code":"","rank":"","experience":""}');
        course['code']=code[i];
        course['rank']=rank[i];
        course['experience']= experience[i];
        newApplicant['courses'].push(course);
    }}
    applicantObj.tas.push(newApplicant);
    res.send("Success");
};


//delete one applicant
exports.deleteOne = function(req, res) {
    var fname = req.query.fname;
    var stunum = req.query.stunum;
    var a = applicantObj['tas'].length;
    for(i = 0; i < applicantObj['tas'].length; i++) {
        if (applicantObj['tas'][i].familyname.toUpperCase() == fname.toUpperCase() || applicantObj['tas'][i].stunum == stunum) {
            applicantObj['tas'].splice(i,1);
        }
    }
    var b = applicantObj['tas'].length;
    if (a == b) {
        res.send("Error: no such student");
    }
    else {
        res.send("Success");
    }
};


//send applicants by status or family name
exports.findAll = function(req, res) {
    var temp;
    var status = req.query.status;
    var fname = req.query.fname;
    var obj = JSON.parse('{"tas":[]}');
    var appObj = JSON.parse(JSON.stringify(applicantObj));
    appObj['tas'].sort(fnamesort);

//by family name
    if (fname != undefined){
        for(i = 0; i < appObj['tas'].length; i++) {
            if (appObj['tas'][i].familyname.toUpperCase() == fname.toUpperCase()) {
                temp = appObj['tas'][i];
                obj['tas'].push(temp);
            }
        }
    }
    else {
        //by status
        if (status != undefined){
            for(i = 0; i < appObj['tas'].length; i++) {
                if (appObj['tas'][i].status.toUpperCase() == status.toUpperCase()) {
                    temp = appObj['tas'][i];
                    delete temp.courses;
                    obj['tas'].push(temp);
                }
            }
        }
        //all applicants
        else {
            for(i = 0; i < appObj['tas'].length; i++) {
                temp = appObj['tas'][i];
                delete temp.courses;
                obj['tas'].push(temp);
            }
        }
    }
    res.send(JSON.stringify(obj));
};


//search all applicants that have taken the course
exports.courseApplicant = function(req, res) {
    var temp;
    var course = req.query.course;
    var i;
    var j;
    var obj = JSON.parse('{"courses":[]}');
    var cs;
    var array = [];
    var obj = JSON.parse('{"courses":[]}');

    //show all courses & applicants related
    if (course == undefined){
        for(k = 0; k< courseObj['courses'].length; k++) {
            cs = courseObj['courses'][k];
            var sth = JSON.parse('{"code":"", "tas":[]}');
            sth.code = cs;
            for(i = 0; i < applicantObj['tas'].length; i++) {
                temp = applicantObj['tas'][i];
                for (j = 0; j < temp['courses'].length; j++) {
                    var app = JSON.parse('{"stunum":"", "givenname":"","familyname":"","status":"","year":"","ranking":"","experience":""}');
                    c = temp['courses'][j]['code'];
                    if (cs == c) {
                        app.stunum=temp.stunum;
                        app.experience= temp['courses'][j]['experience'];
                        app.ranking= temp['courses'][j]['rank'];
                        app.status= temp.status;
                        app.givenname=temp.givenname;
                        app.familyname=temp.familyname;
                        app.year=temp.year;
                        array.push(app);
                    }
                }  
            }
            array.sort(ranksort);
            for (l=0; l<array.length; l++){
                sth["tas"].push(array[l]);
            }
            obj["courses"].push(sth);
            array = [];
        }
    }
    //show all applicants taken the course
    else {
            var sth = JSON.parse('{"code":"", "tas":[]}');
            sth.code = course.toUpperCase();
            for(i = 0; i < applicantObj['tas'].length; i++) {
                temp = applicantObj['tas'][i];
                for (j = 0; j < temp['courses'].length; j++) {
                    var app = JSON.parse('{"stunum":"", "givenname":"","familyname":"","status":"","year":"","ranking":"","experience":""}');
                    c = temp['courses'][j]['code'];
                    if (course.toUpperCase() == c.toUpperCase()) {
                        app.stunum=temp.stunum;
                        app.experience= temp['courses'][j]['experience'];
                        app.ranking= temp['courses'][j]['rank'];
                        app.status= temp.status;
                        app.givenname=temp.givenname;
                        app.familyname=temp.familyname;
                        app.year=temp.year;
                        array.push(app);
                    }
                }  
            }
            array.sort(ranksort);
            for (l=0; l<array.length; l++){
                sth["tas"].push(array[l]);
            }
            obj["courses"].push(sth);
            array = [];     
    }
    res.send(JSON.stringify(obj));
};

