console.log('🧪 Testing login functionality...');

// Fill clinic code input
const input = document.querySelector('.login-input');
if (input) {
    input.value = 'test-clinic-code';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('✅ Filled clinic code: test-clinic-code');
} else {
    console.log('❌ Input not found');
}

// Click continue button
setTimeout(() => {
    const button = document.querySelector('.login-button');
    if (button) {
        console.log('✅ Clicking continue button...');
        button.click();
    } else {
        console.log('❌ Button not found');
    }
}, 1000);
