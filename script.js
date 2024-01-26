document.addEventListener('DOMContentLoaded', () => {
    const createBlogButton = document.getElementById('createBlogButton');
    const createBlogForm = document.getElementById('createBlogForm');
    const submitBlogButton = document.getElementById('submitBlogButton');
    const blogList = document.getElementById('blogs');

    const blogs = [];

    if (createBlogButton && createBlogForm) {
        createBlogButton.addEventListener('click', () => {
            createBlogForm.style.display = createBlogForm.style.display === 'none' ? 'block' : 'none';
        });
    }

    if (submitBlogButton) {
        submitBlogButton.addEventListener('click', (event) => {
            event.preventDefault();
            const blogTitle = document.getElementById('blogTitleInput').value;
            const blogDescription = document.getElementById('blogDescriptionInput').value;
            const blogImageURL = document.getElementById('blogImageInput').value;

            if (!blogTitle && !blogDescription) {
                alert('Please provide at least a title or description for the blog.');
                return;
            }

            const newBlog = { id: generateUniqueId(), title: blogTitle, description: blogDescription, imageURL: blogImageURL, likes: 0, comments: [] };
            blogs.push(newBlog);

            createBlogCard(newBlog);

            document.getElementById('blogTitleInput').value = '';
            document.getElementById('blogDescriptionInput').value = '';
            document.getElementById('blogImageInput').value = '';

            createBlogForm.style.display = 'none';
        });
    }

    fetchBlogs();
});




function fetchBlogs() {
    if (Array.isArray(blogs)) {
        blogs.forEach(blog => {
            createBlogCard(blog);
        });
    } else {
        console.error('Invalid blogs data:', blogs);
    }
}

function addBlog(title, description, imageURL) {
    const newBlog = { title, description, imageURL, likes: 0, comments: [] };
    blogs.push(newBlog);
    createBlogCard(newBlog);
}

function createBlogCard(blog) {
    const blogList = document.getElementById('blogs');

    const blogCard = document.createElement('div');
    blogCard.className = 'blog-card';

    const blogTitle = document.createElement('h2');
    blogTitle.textContent = blog.title || 'Untitled Blog';

    const blogDescription = document.createElement('p');
    blogDescription.textContent = blog.description || '';
    blogDescription.style.display = 'none';

    const blogImage = document.createElement('img');
    blogImage.src = blog.imageURL;
    blogImage.alt = 'Blog Image';
    blogImage.style.maxWidth = '100%';
    blogImage.style.display = blog.imageURL ? 'block' : 'none';

    const readMoreButton = createButton('Read More');
    readMoreButton.addEventListener('click', () => {
        toggleVisibility(blogDescription, blogImage, commentsContainer);
    });

    const updateButton = createButton('Update');
    const likeButton = createButton(`Like (${blog.likes})`);
    const deleteButton = createButton('Delete');
    const commentButton = createButton('Comment');

    [updateButton, likeButton, deleteButton, commentButton].forEach(button => {
        button.style.marginRight = '5px';
    });

    updateButton.addEventListener('click', () => {
        updateBlog(blog);
    });

    likeButton.addEventListener('click', () => {
        likeBlog(blog, likeButton);
    });

    deleteButton.addEventListener('click', () => {
        deleteBlog(blog);
    });

    commentButton.addEventListener('click', () => {
        commentBlog(blog, commentsContainer);
    });

    const buttonsDiv = document.createElement('div');
    buttonsDiv.style.display = 'flex';
    buttonsDiv.appendChild(readMoreButton);
    buttonsDiv.appendChild(updateButton);
    buttonsDiv.appendChild(likeButton);
    buttonsDiv.appendChild(deleteButton);
    buttonsDiv.appendChild(commentButton);

    const commentsContainer = document.createElement('div');
    commentsContainer.id = `comments-${blog.id}`;
    commentsContainer.style.display = 'none'; 

    blogCard.appendChild(blogTitle);
    blogCard.appendChild(blogDescription);
    blogCard.appendChild(blogImage);
    blogCard.appendChild(buttonsDiv);
    blogCard.appendChild(commentsContainer);

    blogList.appendChild(blogCard);
}

function commentBlog(blog, commentsContainer) {
    const comment = prompt('Enter your comment:');
    if (comment) {
        blog.comments.push(comment);

        const commentDiv = document.createElement('div');
        commentDiv.textContent = comment;
        commentsContainer.appendChild(commentDiv);

        alert(`Comment added to blog "${blog.title}": ${comment}`);
    }
}

function createButton(text) {
    const button = document.createElement('button');
    button.textContent = text;
    return button;
}

function toggleVisibility(...elements) {
    elements.forEach(element => {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    });
}

function deleteBlog(blog) {
    const confirmDelete = confirm('Are you sure you want to delete this blog?');
    
    if (confirmDelete) {
        if (!Array.isArray(blogs)) {
            console.error('Invalid blogs data:', blogs);
            return;
        }

        const blogIndex = blogs.findIndex(b => b.id === blog.id);

        if (blogIndex !== -1) {
            blogs.splice(blogIndex, 1);
            const blogList = document.getElementById('blogs');
            blogList.innerHTML = '';

            fetchBlogs();
        } else {
            console.error('Blog not found:', blog);
        }
    }
}

function likeBlog(blog, likeButton) {
    blog.likes++;
    updateLikesInLocalStorage(blog);
    likeButton.textContent = `Like (${blog.likes})`;
    alert(`Liked blog: "${blog.title}" - Likes: ${blog.likes}`);
}

function commentBlog(blog) {
    const comment = prompt('Enter your comment:');
    if (comment) {
        blog.comments.push(comment);
        updateCommentsInLocalStorage(blog);
        alert(`Comment added to blog "${blog.title}": ${comment}`);
    }
}

function updateLikesInLocalStorage(blog) {
    let storedBlogs = JSON.parse(localStorage.getItem('blogs')) || [];

    storedBlogs = storedBlogs.map(storedBlog => {
        if (storedBlog.id === blog.id) {
            return { ...storedBlog, likes: blog.likes };
        } else {
            return storedBlog;
        }
    });

    localStorage.setItem('blogs', JSON.stringify(storedBlogs));
}

function updateCommentsInLocalStorage(blog) {
    let storedBlogs = JSON.parse(localStorage.getItem('blogs')) || [];

    storedBlogs = storedBlogs.map(storedBlog => {
        if (storedBlog.id === blog.id) {
            return { ...storedBlog, comments: blog.comments };
        } else {
            return storedBlog;
        }
    });

    localStorage.setItem('blogs', JSON.stringify(storedBlogs));
}

function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}
