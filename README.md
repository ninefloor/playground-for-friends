# playground-for-honeyz

지인들과의 놀이 공간을 위한 Web App입니다.

- Firebase의 Realtime DB를 활용해 각자의 기기에서 실시간 투표
- admin 페이지에서 실시간으로 결과 확인 및 투표 결과 시각화

## 실시간 투표 with [piku](https://piku.co.kr)

![vote](https://github.com/ninefloor/playground-for-honeyz/assets/77656241/c7304ff6-465c-45f7-bcd4-66ebfc80f30d)

- 유저는 각자 자신의 계정으로 로그인 해 투표에 참여할 수 있습니다.
- 유저가 로그인하면 admin 페이지에서 감지해 유저 목록에 추가합니다.
- 투표한 결과는 admin 페이지에 즉시 반영되며, 모든 투표를 마치면 결과가 출력됩니다.
