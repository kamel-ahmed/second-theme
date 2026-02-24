// login background handleing (slide show bg - only one bg - default bg) in theme doc

let background = frappe?.boot?.theme_setting?.login_background

if (frappe?.boot?.theme_setting?.is_slideshow == 0) {
    // console.log("is_slideshow" , frappe?.boot?.theme_setting?.is_slideshow , "background" , background );
    
    if (background != "") {
        document.body.style.backgroundImage = `url(${background})`;
        document.body.style.backgroundSize = "cover"
        document.body.style.color = "black"
    } 
    // else {
        // document.body.style.backgroundImage = `url('https://img.freepik.com/free-vector/bubbles-blue-background_331749-689.jpg?semt=ais_hybrid&w=740&q=80')`;
        // document.body.style.backgroundSize = "cover"
    // }
} else {
    let slide_show_imgs = frappe?.boot?.theme_setting?.background_list || [];
    
    let index = 0;

    if (slide_show_imgs.length > 0) {
        // initial Image
        document.body.style.backgroundImage = `url(${slide_show_imgs[0].background_image})`;
        document.body.style.backgroundSize = "cover"

        setInterval(() => {
            document.body.style.backgroundImage = `url(${slide_show_imgs[index].background_image})`;
            document.body.style.backgroundSize = "cover";
            document.body.style.color = "black";
            index = (index + 1) % slide_show_imgs.length;
        }, 2000);
    }else{
        document.body.style.backgroundImage = `url('https://img.freepik.com/free-vector/bubbles-blue-background_331749-689.jpg?semt=ais_hybrid&w=740&q=80')`;
        document.body.style.backgroundSize = "cover"
    }
}

// =================================================================
