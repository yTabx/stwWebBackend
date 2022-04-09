const express = require('express');
const router = express.Router();
const validator = require("email-validator");


const Publication = require('../../models/Publication');
const Author = require('../../models/Author');

router.get('/get-all', (req,res) => {
    console.log("get all.....");
    Publication.find().then(publications => res.json(publications));
    
});
router.get('/get/:id', (req,res) => {
    console.log("get one.....");
    Publication.find({_id:req.params.id}).then(publications => res.json(publications));
    
});

router.post('/create', async(req,res) => {
    
    
    console.log("attempting to post new publication to db ... \n");
    //book and author info
    const title = "testbook7";
    const authorFirstName = "testAuthor7";
    const authorOtherName = "testAuthorSecondName7";
    const authorInfo = "this is author info7: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer consequat faucibus ex in sollicitudin. Vestibulum bibendum iaculis est ut suscipit. Phasellus nisl odio, tincidunt ac mattis in, fringilla et nisi. Pellentesque aliquam, leo eget sodales imperdiet, mi libero aliquam enim, sit amet molestie justo metus et sapien. Proin scelerisque nec leo vitae tristique. Pellentesque sodales nisi imperdiet, semper metus eu, tempus nisl. Maecenas orci turpis, porta et nisl id, vestibulum aliquam justo. Nullam tempor luctus lectus non hendrerit. Curabitur id nulla aliquam, sodales nulla in, maximus neque. Sed vitae efficitur ex, sit amet ornare orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in ex ut nulla semper molestie eget ut est. Aenean eget massa nec lorem consectetur rhoncus vel ut nunc."

    const description = "this is description7:Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer consequat faucibus ex in sollicitudin. Vestibulum bibendum iaculis est ut suscipit. Phasellus nisl odio, tincidunt ac mattis in, fringilla et nisi. Pellentesque aliquam, leo eget sodales imperdiet, mi libero aliquam enim, sit amet molestie justo metus et sapien. Proin scelerisque nec leo vitae tristique. Pellentesque sodales nisi imperdiet, semper metus eu, tempus nisl. Maecenas orci turpis, porta et nisl id, vestibulum aliquam justo. Nullam tempor luctus lectus non hendrerit. Curabitur id nulla aliquam, sodales nulla in, maximus neque. Sed vitae efficitur ex, sit amet ornare orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in ex ut nulla semper molestie eget ut est. Aenean eget massa nec lorem consectetur rhoncus vel ut nunc.";

    const thumbnailLink = "/";
    const downloadLink = "/";
    const isbn =  "this is the isbn";
    const publicationDate= "01/01/2022";
    const noPages = 100;
    const language = "english";
    const originalLanguage = "english";
    const format = "pdf";
    const price = 0;


    //if author exists then add book and author id 
    //esle create new author post then add book and author id
    //look for author 

    const authorResp = await Author.find({firstName: authorFirstName, otherNames: authorOtherName}).limit(1);
    //also check valid email adress
    if ((authorResp.length === 0)) {
        //create new author
        console.log("author doesnt exist posting new author");

        const newAuthor = new Author({
            firstName: authorFirstName,
            otherNames: authorOtherName,
            info: authorInfo
        });

        await newAuthor.save();


        //get the id
        const authorResp = await Author.find({firstName: authorFirstName, otherNames: authorOtherName}).limit(1);
        console.log(authorResp);
     

        const authorID = authorResp[0]._id
        console.log("id: ",authorResp[0]._id);
        
        //create new book
        const newPublication = new Publication({
            title:title,
            authorID: authorID,
            desc: description,
            thumbnailLink: thumbnailLink,
            downloadLink: downloadLink,
            isbn: isbn,
            publicationDate: publicationDate,
            noPages:noPages,
            language:language,
            originalLanguage:originalLanguage,
            format:format,
            price:price,
   
        });
        console.log("1");

        await newPublication.save().then(publications => res.json(publications));
        console.log("2");
        console.log("posted..\n");

        
    }
    else{
        //check if book already exists 
        console.log("author exists posting new book with author id");
        const publicationResp = await Publication.find({title: title}).limit(1);
        if (publicationResp.length === 0){

            //get author id
            console.log(authorResp);
            const authorID = authorResp[0]._id;
            //create new book
            const newPublication = new Publication({
                title:title,
                authorID: authorID,
                desc: description,
                thumbnailLink: thumbnailLink,
                downloadLink: downloadLink,
                isbn: isbn,
                publicationDate: publicationDate,
                noPages:noPages,
                language:language,
                originalLanguage:originalLanguage,
                format:format,
                price:price,
    
            });

            await newPublication.save().then(publications => res.json(publications));

            console.log("posted..\n");

            

        }else{
            //book already exists
            console.log("book already exists under this author");
        }
    }
    res.send().end();
}); 

module.exports = router;