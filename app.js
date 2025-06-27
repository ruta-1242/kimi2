// QUESTIONS is defined globally in questions.js

const NUM_QUESTIONS = 15;
const POINT_PER_QUESTION = 100 / NUM_QUESTIONS;
let currentIndex = 0;
let score = 0;
let selectedQuestions = [];

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const retryBtn = document.getElementById('retry-btn');
const shareBtn = document.getElementById('share-btn');
const progressEl = document.getElementById('progress');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const scoreText = document.getElementById('score-text');
const rankText = document.getElementById('rank-text');
const toast = document.getElementById('toast');

startBtn.addEventListener('click', startQuiz);
retryBtn.addEventListener('click', startQuiz);
shareBtn.addEventListener('click', shareScore);

function startQuiz(){
  // init
  currentIndex = 0;
  score = 0;
  // random sample without replacement
  selectedQuestions = shuffleArray([...QUESTIONS]).slice(0, NUM_QUESTIONS);

  // UI
  startScreen.classList.add('hidden');
  startScreen.classList.remove('active');
  resultScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  showQuestion();
}

function showQuestion(){
  const q = selectedQuestions[currentIndex];
  progressEl.textContent = `第 ${currentIndex+1} 問 / 全${NUM_QUESTIONS} 問`;
  questionEl.textContent = q.question;
  optionsEl.innerHTML = '';

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'primary-btn';
    btn.textContent = opt;
    btn.style.opacity = 0;
    btn.addEventListener('click', () => handleAnswer(idx));
    optionsEl.appendChild(btn);
    // fade-in animation
    requestAnimationFrame(()=>{
      btn.style.transition = 'opacity .2s';
      btn.style.opacity = 1;
    });
  });
}

function handleAnswer(idx){
  const q = selectedQuestions[currentIndex];
  const correct = q.answer === idx;
  if(correct) score += POINT_PER_QUESTION;
  // show toast
  showToast(correct ? '正解！' : `不正解… 正答: ${q.options[q.answer]}`, correct);

  // next or result after 1s
  setTimeout(() => {
    currentIndex++;
    if(currentIndex < NUM_QUESTIONS){
      showQuestion();
    } else {
      showResult();
    }
  }, 1000);
}

function showResult(){
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');

  const finalScore = Math.ceil(score);
  scoreText.textContent = `あなたの得点：${finalScore} 点 / 100 点`;
  const rate = finalScore;
  let rank = '';
  if(rate >= 90){
    rank = '房総マスター';
  }else if(rate >= 70){
    rank = '君津エキスパート';
  }else if(rate >= 50){
    rank = '君津ビギナー';
  }else{
    rank = 'チャレンジャー';
  }
  rankText.textContent = `称号：${rank}`;
}

function shareScore(){
  const text = `君津検定で${Math.ceil(score)}点を獲得しました！ #君津検定`;
  const url = location.href;
  if (navigator.share) {
    navigator.share({ title: '君津検定', text, url });
  } else {
    // fallback copy to clipboard
    navigator.clipboard.writeText(`${text} ${url}`).then(()=>alert('テキストをコピーしました'));
  }
}

function showToast(message, isSuccess){
  toast.textContent = message;
  toast.className = `toast show ${isSuccess ? 'success' : 'error'}`;
  setTimeout(()=>{
    toast.classList.remove('show');
  }, 800);
}

function shuffleArray(arr){
  for (let i = arr.length -1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
