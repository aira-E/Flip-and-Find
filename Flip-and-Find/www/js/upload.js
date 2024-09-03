document.getElementById('uploadForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const imageInputs = document.querySelectorAll('#imageInputs input[type="file"]');
    const imageData = [];

    imageInputs.forEach((input, index) => {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const imagePath = `../json/${file.name}`;
                const imageName = file.name.split('.')[0]; // Use the filename as the name

                // Add the image data to the array
                imageData.push({
                    "image": imagePath,
                    "name": imageName
                });

                // When all images have been read
                if (imageData.length === imageInputs.length) {
                    createJsonFile(imageData);
                }
            };

            reader.readAsDataURL(file);
        }
    });
});

function createJsonFile(data) {
    const jsonData = JSON.stringify(data, null, 4);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom.json';
    a.click();

    URL.revokeObjectURL(url);
}
