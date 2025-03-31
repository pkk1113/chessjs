// 상수
const pieceToClass = {
  'bk': 'piece black-piece bk',
  'bq': 'piece black-piece bq',
  'br': 'piece black-piece br',
  'bb': 'piece black-piece bb',
  'bn': 'piece black-piece bn',
  'bp': 'piece black-piece bp',
  'wk': 'piece white-piece wk',
  'wq': 'piece white-piece wq',
  'wr': 'piece white-piece wr',
  'wb': 'piece white-piece wb',
  'wn': 'piece white-piece wn',
  'wp': 'piece white-piece wp',
}

const defaultBoardString =
  'a8brb8bnc8bbd8bqe8bkf8bbg8bnh8br' +
  'a7bpb7bpc7bpd7bpe7bpf7bpg7bph7bp' +
  'a2wpb2wpc2wpd2wpe2wpf2wpg2wph2wp' +
  'a1wrb1wnc1wbd1wqe1wkf1wbg1wnh1wr';

const copyUrlButton = document.querySelector('#copy-url-btn');
copyUrlButton.addEventListener('click', () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    console.log('URL이 복사되었습니다!');
  }).catch((err) => {
    console.error('URL 복사 실패:', err);
  });
});

const resetButton = document.querySelector('#reset-btn');
resetButton.addEventListener('click', () => {
  const url = window.location.href;
  const newUrl = url.split('?')[0];
  history.pushState(null, '', newUrl);
  location.reload();
});

function main() {
  // URL 에서 보드 문자열 가져오기
  let boardString = parceURL();
  if (boardString === null) {
    pushURL(defaultBoardString);
    boardString = defaultBoardString;
  }

  // 보드 문자열을 디코딩하여 기물 객체 생성
  const pieces = decodeBoard(boardString);
  generatePieces(pieces);

  // 보드 셀 클릭 이벤트 등록
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell) => {
    cell.addEventListener('click', () => {
      const selectedPiece = document.querySelector('.selected');
      console.log(selectedPiece);

      if (selectedPiece) {
        // 선택된 기물의 위치를 가져온다.
        const selectedPos = selectedPiece.parentElement.className.split(' ')[2];
        // 클릭한 셀의 위치를 가져온다.
        const cellPos = cell.className.split(' ')[2];
        console.log(selectedPos, cellPos);

        // 이동
        if (selectedPos !== cellPos) {
          pieces[cellPos] = pieces[selectedPos];
          delete pieces[selectedPos];

          const newBoardString = encodeBoard(pieces);
          pushURL(newBoardString);

          placePiece(cell, selectedPiece);
        }
      }
    });
  });
}

function parceURL(url) {
  const query = new URLSearchParams(window.location.search);
  let boardString = query.get('address');
  return boardString;
}

function pushURL(boardString) {
  history.pushState(null, '', `?address=${boardString}`);
}

function generatePieces(pieces) {
  let boardSelectedPiece = null;

  for (const [pos, piece] of Object.entries(pieces)) {
    const cell = document.querySelector(`.${pos}`);

    const pieceTemplate = document.createElement('div');
    pieceTemplate.className = pieceToClass[piece];

    pieceTemplate.addEventListener('click', () => {
      // 이미 선택된 기물이 있다면 선택 해제
      if (boardSelectedPiece) {
        boardSelectedPiece.classList.toggle('selected');

        // 선택된 기물과 클릭한 기물이 같다면 선택 해제만 하고 종료
        if (boardSelectedPiece === pieceTemplate) {
          boardSelectedPiece = null;
          return;
        }
      }

      // 선택된 기물이 없다면 선택
      boardSelectedPiece = pieceTemplate;
      pieceTemplate.classList.toggle('selected');
    });

    cell.appendChild(pieceTemplate);
  }
}

function decodeBoard(boardString) {
  const pieces = {};
  for (let i = 0; i < boardString.length; i += 4) {
    const pos = boardString.slice(i, i + 2);     // 예: "a2"
    const piece = boardString.slice(i + 2, i + 4); // 예: "bk"
    pieces[pos] = piece;
  }
  return pieces;
}

function encodeBoard(pieces) {
  let boardString = '';
  for (const [pos, piece] of Object.entries(pieces)) {
    if (pos.length === 2 && piece.length === 2) {
      boardString += pos + piece;
    }
  }
  return boardString;
}

function placePiece(cell, piece) {
  if (cell && piece) {
    cell.innerHTML = '';
    cell.appendChild(piece);
  }
}

main();