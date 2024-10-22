const encoder = new TextEncoder()
function generatePassword() {
    let possibleText = ""
    if (document.getElementById("numbers").checked) {
        possibleText += "0123456789"
    }
    if (document.getElementById("upper").checked) {
        possibleText += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    }
    if (document.getElementById("lower").checked) {
        possibleText += "abcdefghijklmnopqrstuvwxyz"
    }
    if (document.getElementById("symbols").checked) {
        possibleText += "!@#$"
    }
    if (document.getElementById("custom").checked) {
        possibleText += document.getElementById("customValue").value
    }
    let fullname = document.getElementById("fullname").value
    let username = document.getElementById("username").value
    let service = document.getElementById("service").value
    let masterpassword = document.getElementById("master").value
    let counter = document.getElementById("counter").value
    // See the section below: "Encoding Notes"
    let password = encoder.encode(masterpassword.normalize('NFKC'));
    let salt = encoder.encode(`${fullname.length}${fullname}${username.length}${username}`.normalize('NFKC'));

    let N = 1024, r = 8, p = 1;
    let dkLen = 32;
    scrypt.scrypt(password, salt, N, r, p, dkLen, function(progress) {}).then(async (key) => {
        let hmacKEY = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]).then();
        let signature = await crypto.subtle.sign("HMAC", hmacKEY, encoder.encode(`${service.length}${service}${counter}`));
        signatureArray = new Uint8Array(signature)
        let text = ""
        for (let i = 0; i < parseInt(document.getElementById("length").value); i++) {
            text += possibleText[signatureArray[i] % possibleText.length]
        }
        document.getElementById("password").innerText = text
    })
}
document.getElementById("generate-button").addEventListener("click", (e) => {
    generatePassword()
})
