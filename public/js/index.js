const socket = io();

const button = document.getElementById('add');

const nameInput = document.getElementById('nameInput');
const lastNameInput = document.getElementById('lastNameInput');
const ageInput = document.getElementById('ageInput');
const emailInput = document.getElementById('emailInput');
const phoneInput = document.getElementById('phoneInput');
const div = document.getElementById('textOutput'); 

button.addEventListener('click', () => { 
    const data = {
        name: nameInput.value,
        lastName: lastNameInput.value,
        age: ageInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
    };
    socket.emit('message', data);
})

socket.on('message', (data) => {
    console.log(data);
    div.innerHTML = `
        <ul>
            ${data.map(
                (p) =>
                    `<li>
                        Nombre: ${p.name}, 
                        Apellido: ${p.lastName}, 
                        Edad: ${p.age}, 
                        Correo: ${p.email}, 
                        Teléfono: ${p.phone}
                    </li>`
            ).join('')}
        </ul>
    `;
})



