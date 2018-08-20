document.addEventListener('DOMContentLoaded', function() {

  const imageId = 12 //Enter your assigned imageId here
  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
  const likeURL = `https://randopic.herokuapp.com/likes/`
  const commentsURL = `https://randopic.herokuapp.com/comments/`

// Variables containing DOM elements to be populated
  const imgTag = document.getElementById('image');
  const imgName = document.getElementById('name');
  const imgLikes = document.getElementById('likes');
  const imgComments = document.getElementById('comments');
  let imgLikeCount;
  const commentForm = document.getElementById('comment_form');
  let currentComment = document.querySelector('#comment_input').value;

// Variables containing DOM interactive elements
  const btnLike = document.getElementById('like_button')

// Event Listeners
  btnLike.addEventListener('click', addLike);
  commentForm.addEventListener('submit', addComment);


// GET the Image data
  let imageJson =
  fetch(imageURL)
  .then(r => r.json())
  .then(renderImage)

// render the data onto the DOM
  function renderImage(image) {
    console.log(image)
    imgLikeCount = image.like_count
    imgTag.src = image.url;
    imgName.innerText = image.name;
    imgLikes.innerText = image.like_count;
    const commentArray = image.comments
    const commentHTML = `
    ${commentArray.map(c => '<li>' + c.content + '&nbsp;&nbsp;<button value="delete" data-id=' + c.id + '>X</button></li>' ).join('')}
    `
    imgComments.innerHTML = commentHTML
    imgComments.addEventListener('click', function (e) {
      if(e.target.value === 'delete') {
        deleteComment(e)
      }})

  }

// add an additional like
  function addLike(e) {
    // Add Like to the front-end
    imgLikeCount++
    imgLikes.innerText = imgLikeCount

    // Post Like to the back-end
    let data = {
      image_id: imageId
    }
    fetch(likeURL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(console.log)
  }

  function addComment(e) {
    // Add Comment to the front-end
    event.preventDefault();
    currentComment = document.querySelector('#comment_input').value
    document.querySelector('#comment_input').value = '';
    const li = document.createElement('li');
    li.append(currentComment);
    imgComments.append(li);

    // Post Comment to the back-end
    let data = {
      image_id: imageId,
      content: currentComment
    }
    fetch(commentsURL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(console.log)
location.reload();

  }

  function deleteComment(e){
    e.target.parentElement.remove()
    commentId = e.target.getAttribute("data-id")
    console.log(commentId)

    fetch(`https://randopic.herokuapp.com/comments/${commentId}`, {
      method: "DELETE"
    })
  }


})
