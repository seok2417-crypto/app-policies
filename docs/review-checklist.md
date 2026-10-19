# 정식 정책 게시 전 검토

검토 기준일: 2026-10-19. 현재 `pending-review`이며 공개 앱 페이지는 준비 안내입니다. 앱 1.7.0의 실제 동작과 공개 공식 자료를 참고해 초안을 작성했으나, 법률 적합성 판정이나 앱 마켓 승인 보장이 아닙니다.

## 운영자 확인

- [x] 운영자 공개명: 서봉석
- [x] 개인정보 문의 이메일: seok247@gmail.com
- [x] 요청 시행일: 2026-10-19
- [ ] 초안 전체에 대한 운영자 승인 및 실제 적용일/변경 고지 방식 확정
- [ ] 공식 2026.4. 작성지침 첨부 PDF 본문 전항목 대조(자동 다운로드 미완료)
- [ ] 개인정보 보호책임자/고충처리 창구의 표시 요건, 처리 근거 및 개별 적용 법률 검토
- [ ] 문의 이메일의 실제 운영 여부와 문의 보관 기간·삭제/권리 요청 절차 확정
- [ ] 아동 대상 여부와 14세 미만 처리 해당 여부 확인

## 기술·외부 서비스 확인

- [ ] NAVER Maps SDK 3.23.3의 실제 자동 수집/전송 항목, 목적, 보관 기간, 처리 주체를 공급자로부터 확인
- [ ] NAVER API HUB 검색어 및 접속/요청 정보의 보관·삭제·처리 주체 확인
- [ ] Google Play Services 위치 API 21.4.0 및 기기 설정에 따른 처리 범위 확인. 코어 base/tasks SDK의 ‘수집 없음’ 문구를 위치 API 전체에 확장 적용하지 않음
- [ ] 제3자 제공/처리 위탁 해당 여부와 제공받는 자/수탁자, 항목·목적·보관 기간 등 적용 고지 확정
- [ ] 국외 이전 여부 확인. 해당하면 국가, 수령자/연락처, 항목, 목적, 시기·방법, 보유 기간, 법적 근거 및 거부 방법/영향 등 해당 요건 검토
- [ ] 저장된 검색 유래 목적지/즐겨찾기의 보관이 최신 API 이용약관과 일치하는지 별도 확인. 확인 전 자동 삭제 기간을 정책에 만들어 쓰지 않음
- [ ] 기기 데이터 삭제와 외부 공급자/문의 이메일의 데이터 삭제를 구분
- [ ] 위치 서비스 관련 법률 적용, 필요한 인앱 고지/동의와 Play 데이터 보안 신고의 일치 여부 검토
- [ ] 정식 방침 링크가 앱 안에서 접근 가능한지 별도 확인(이 작업에서 앱 수정 안 함)

## 공식 참고 자료

아래는 일반 정책과 API 기능의 근거입니다. 일반 개인정보처리방침이 특정 SDK 버전의 모든 네트워크 동작을 확정해 주는 것은 아닙니다.

- [Google Play 사용자 데이터 정책](https://support.google.com/googleplay/android-developer/answer/10144311?hl=ko): 개인정보처리방침, 연락 창구, 처리/보관/삭제 및 SDK 포함 공개 요구
- [개인정보보호위원회 작성지침 2026.4. 개정](https://pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS217&mCode=G010030030&nttId=12018): 항목별 작성과 공개 범위 검토
- [NAVER 지도 Android SDK 가이드](https://navermaps.github.io/android-map-sdk/guide-ko/): 지도/위치 오버레이 기능. 개인정보 전체 수집 명세로 간주하지 않음
- [NAVER API HUB 지역검색 명세](https://api.ncloud-docs.com/docs/naver-api-hub-search-local): 검색 요청과 결과 항목
- [NAVER API HUB 서비스 개요](https://guide.ncloud-docs.com/docs/apihub-overview): NAVER 사업 주체와 네이버클라우드 중개 운영 구분
- [NAVER API HUB 약관 개정 안내](https://www.ncloud.com/support/notice/all/2243): 2026-09-20 적용 안내. 검색 결과 보관 등 해당 여부 확인 필요
- [NAVER Cloud 개인정보처리방침](https://privacy.navercloudcorp.com/ko/ncp/PrivacyPolicy/ncp-p): 공급자 일반 방침(2026-09-30 시행 본문 표시 확인). 실제 계약/SDK 적용 범위는 별도 확인 필요
- [Google Fused Location Provider](https://developers.google.com/location-context/fused-location-provider): 센서/GPS/Wi-Fi 기반 위치 제공
- [Google Play Services 데이터 공개 안내](https://developers.google.com/android/guides/play-data-disclosure): base/basement/OSS/tasks에 한정된 문서임에 주의
- [Google 개인정보처리방침](https://policies.google.com/privacy?hl=ko): Google 일반 방침
- [GitHub 개인정보 안내](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement): 이 정책 사이트의 호스팅 제공자

명세 확인 및 운영자의 승인 전에는 정식 정책을 공개하지 않습니다. 확인되지 않은 국외 이전/자동 수집/보관 기간은 ‘없음’이라고 단정하지 않습니다.
