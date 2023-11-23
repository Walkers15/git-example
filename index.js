const content = document.querySelector('.content');
const url = 'https://hgm-main.p-e.kr';
let uuid;
let profiles;

async function getAudio(nickname) {
  const audioUrls = await axios({
    method: 'get',
    url: `${url}/profile/voice/${nickname}`,
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${uuid}`
    }
  });

  // 오디오 박기
  const audioUrl = audioUrls.data.data[0].url;
  console.log(audioUrl);

  const audioElement = document.createElement('audio');

  audioElement.src = audioUrl;
  audioElement.controls = true;
  audioElement.autoplay = true;
  audioElement.style.display = 'none';
  content.appendChild(audioElement);

  // const audio = await axios({
  //   method: 'get',
  //   url: audioUrl
  // });
  // console.log(audio);

  // const profile = await axios({
  //   method: 'get',
  //   url: profileUrl
  // });
  // console.log(profile);
}

async function getProfile() {
  // uuid 받아오기
  uuid = document.querySelector('#uuid').value;

  profiles = await axios({
    method: 'get',
    url: `${url}/profile`,
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${uuid}`
    }
  });

  // 이미지 박기
  console.log(profiles);
  profiles.data.data.forEach(profile => {
    const img = document.createElement('img');
    img.style.width = '100px';
    img.style.height = '100px';
    img.src = profile.profileUrl;
    content.appendChild(img);

    const audioButton = document.createElement('button');
    audioButton.innerText = '오디오';
    audioButton.addEventListener('click', getAudio.bind(this, profile.nickname));
    content.appendChild(audioButton);
  });
}