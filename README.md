# playground-for-honeyz
지인들과의 놀이 공간을 위한 Web App입니다. 
- Firebase의 Realtime DB를 활용해 각자의 기기에서 실시간 투표
- admin 페이지에서 실시간으로 결과 확인 및 투표 결과 시각화

## 실시간 투표 with [piku](https://piku.co.kr)

![vote](https://github.com/ninefloor/playground-for-honeyz/assets/77656241/c7304ff6-465c-45f7-bcd4-66ebfc80f30d)

- 유저는 각자 자신의 계정으로 로그인 해 투표에 참여할 수 있습니다.
- 유저가 로그인하면 admin 페이지에서 감지해 유저 목록에 추가합니다.
- 투표한 결과는 admin 페이지에 즉시 반영되며, 모든 투표를 마치면 결과가 출력됩니다.

## 티어게임 with [Tiermaker](https://tiermaker.com/)

![tier](https://github.com/ninefloor/playground-for-honeyz/assets/77656241/c2b37cf7-abe8-4213-a655-c114cd98edec)

- 유저가 로그인하면 admin 페이지에서 감지해 유저 목록에 추가합니다.
- 해당 차례에 티어를 정할 유저는 자신의 투표 화면에서 본인이 생각하는 티어를 고릅니다.
- 해당 티어에 대해 다른 유저는 동의 / 비동의 에 대한 투표를 진행합니다.
- 투표 결과에 따라 티어리스트에 등재됩니다.
