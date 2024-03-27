// let csrfToken = '';

// fetch("/csrf")
// .then(response => {
//     const csrfHeader = response.headers.get('X.CSRF-TOKEN');
//     if(csrfToken){
//         csrfToken = csrfHeader;
//     }
// });

// function postData(url = 'http://localhost:8080/signup',data = {}){
//     return fetch(url,{
//         method:"POST",
//         headers:{
//             'Content-Type': 'application.json',
//             'X-CSRF-TOKEN':csrfToken
//         },
//         body:JSON.stringify(data)

//     });
// }

// postData('/signup', { username: 'testUser', password: 'testPass' })
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch((error) => console.error('Error:', error));
