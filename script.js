const fileInput = document.getElementById('file-input');
const errorMessage = document.getElementById('error-message');
const resultMessage = document.getElementById('result-message');
const resultLink = document.getElementById('result-link');
const copyButton = document.getElementById('copy-button');
const shareButton = document.getElementById('share-button');

console.log("\n" + 
"よくわからないコードを入力したり貼り付けないでください\n" + 

"　　　ミ~￣￣￣＼\n" +
"　　　/ ＿＿＿＿亅\n" +
"　　 / ＞ ⌒　⌒｜\n" +
"　　｜/　(･) (･)｜\n" +
"　　(6――○-○-｜\n" +
"　　｜　　　つ　｜\n" +
"　　｜　　＿＿_)/\n" +
"　　 ＼　(＿／ /\n" +
"　　 ／＼＿＿／\n" +
"　　/　 ＼><∧\n" +
"　 / /　　Ｖ||\n" +
"　/_/　　 ｜||\n" +
"⊂ﾆu＼＿_／Lu⊃\n" +
"　　｜　 / /\n" +
"　　｜　/ /\n" +
"　　｜ / /\n" +
"　　(ﾆフフ")

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0, img.width, img.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        displayResult(code.data);
      } else {
        displayError('QRコードが検出されませんでした。');
      }
    };
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
});

resultLink.addEventListener('click', () => {
  const content = resultLink.getAttribute('data-content');
  if (content) {
    window.open(content, '_blank');  // 新しいタブで開く
  }
});

copyButton.addEventListener('click', () => {
  const content = resultLink.getAttribute('data-content');
  if (content) {
    navigator.clipboard.writeText(content)
      .then(() => {
        // テキストでコピーしましたと表示
        resultMessage.innerText = 'URLをコピーしました';
      })
      .catch((err) => console.error('コピーに失敗しました', err));
  }
});

shareButton.addEventListener('click', () => {
  const content = resultLink.innerText;
  if (content) {
    // 共有処理を追加
    shareContent(content);
  }
});

function displayResult(content) {
  errorMessage.innerText = '';
  resultMessage.innerText = '読み取り結果: ';
  resultLink.innerText = content;
  resultLink.setAttribute('data-content', content);
  resultLink.style.display = 'inline-block';
  copyButton.style.display = 'inline-block';
  shareButton.style.display = 'inline-block';
}

function displayError(message) {
  errorMessage.innerText = message;
  resultMessage.innerText = '';
  resultLink.style.display = 'none';
  copyButton.style.display = 'none';
  shareButton.style.display = 'none';
}

function shareContent(content) {
  const shareText = '' + content;
  const shareURL = encodeURIComponent(shareText);

  if (navigator.share) {
    // Web Share APIをサポートしている場合
    navigator.share({
      title: 'QRコード共有',
      text: shareText,
    })
      .then(() => console.log('共有成功'))
      .catch((error) => console.error('共有エラー', error));
  } else {
    // Web Share APIがサポートされていない場合、独自の共有メッセージを表示
    alert('ご利用のブラウザでは共有機能をご利用いただけません、');
  }
}