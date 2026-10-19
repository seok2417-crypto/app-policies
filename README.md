# 앱 개인정보처리방침

여러 앱의 방침을 앱별 독립 URL로 관리하는 GitHub Pages 정적 사이트입니다. HTML/CSS/SVG만 사용합니다. 외부 폰트·분석·광고·추적·폼·지도 SDK·앱 API를 사이트에 포함하지 않습니다. 별도 서버나 유료 서비스를 추가하지 않습니다.

## 현재 공개 범위

- 사이트: https://seok2417-crypto.github.io/app-policies/
- 내릴 때 깨워줘: https://seok2417-crypto.github.io/app-policies/arrival-alarm/
- **현재는 게시 준비 안내만 공개합니다. 개인정보처리방침 정식 게시/법률 검토 완료 상태가 아닙니다. 앱 마켓 제출용으로 사용하지 마세요.**
- 운영자명과 문의 이메일은 운영자가 직접 제공한 공개용 정보를 사용합니다. 요청 시행일은 2026-10-19이지만 방침 승인 전이므로 시행일로 확정하지 않습니다. 실제 승인 시 적용일과 고지 시점을 다시 검토합니다.
- 앱의 개인정보처리방침 초안 및 비공개 코드 근거는 공개 저장소 밖의 로컬 검토 자료에만 보관합니다. `.gitignore`와 Pages의 색인 제외만으로 비공개가 되는 것은 아닙니다. 공개 Git에 초안을 커밋하지 마세요.

## 폴더 구조

```text
index.html                 앱 목록
arrival-alarm/index.html   앱별 고정 URL(지금은 준비 안내)
assets/styles.css          공통 스타일
assets/icon.svg            공통 아이콘
404.html                   잘못된 경로 안내
policy-status.json         앱별 승인/시행 상태
docs/review-checklist.md   정식 게시 전 체크리스트 및 공식 자료
docs/validation.md         검증 결과와 남은 제한
scripts/validate.mjs       의존성 없는 정적 구조·링크·공개 범위 검사
.nojekyll                  Jekyll 변환 없이 정적 파일 제공
```

## GitHub Pages 설정

저장소의 **Settings → Pages → Build and deployment**에서 다음과 같이 저장합니다.

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/(root)**

배포 완료 전에는 URL이 404일 수 있습니다. Actions의 `pages build and deployment` 결과 및 실제 URL 응답을 확인합니다. 저장소나 앱 코드의 공개 범위는 바꾸지 마세요. 이 사이트를 게시하는 것과 앱 방침을 정식 승인하는 것은 별개입니다.

## 새 앱 추가

1. URL로 사용할 소문자 영문·숫자·하이픈 slug를 정합니다. 예: `new-app`.
2. `<slug>/index.html`을 만들고 앱 이름, title/description, 연락처를 해당 앱에 맞게 변경합니다. 운영자·시행일·실제 데이터 처리·SDK 내용을 추측하지 않습니다.
3. 미승인 앱에는 명확한 준비 안내만 넣습니다. 정책 초안은 공개 저장소 밖에서 검토합니다.
4. 공통 CSS/아이콘은 `../assets/`로 연결하고 홈은 `../`로 연결합니다. 홈 목록의 링크는 `<slug>/`를 사용합니다. `/arrival-alarm/`처럼 프로젝트 접두어가 없는 루트 절대 경로를 쓰지 않습니다.
5. `index.html`의 앱 목록에 카드를 추가하고 등록 앱 개수/접근성 이름을 갱신합니다.
6. `policy-status.json`에 앱과 승인 상태를 등록합니다. 운영자 검토와 사실/법률 확인 전에는 `approved: false`, `effective_date: null`을 유지합니다.
7. 검증 스크립트를 실행하고 모바일/PC, 키보드 이동, 공개 파일을 검수한 뒤 커밋/푸시합니다.

```shell
node scripts/validate.mjs
node scripts/validate.mjs --external
```

Node.js는 개발 시 검증에만 사용하며 배포/사이트 실행에는 필요하지 않습니다. 웹 테스트 서버는 로컬 검증용일 뿐 운영 서버가 아닙니다.

## 정식 방침 게시 절차

1. 앱 실제 버전, 처리 목적/항목/근거, 보관/삭제, 외부 서비스, 처리 위탁/제3자 제공/국외 이전의 적용 여부를 확인합니다. 공급자 일반 정책을 해당 SDK의 확정 처리 명세로 간주하지 않습니다.
2. 운영자/개인정보 담당 창구, 요청 처리 방법·기간, 아동 대상 여부, 시행일·변경 안내를 운영자가 검토합니다.
3. 실제 초안을 운영자가 읽고 명시적으로 승인해야 합니다. 미확정 항목이 있으면 준비 안내를 유지합니다.
4. 앱별 index를 승인된 방침 본문으로 교체하고 `policy-status.json`을 함께 변경합니다. 승인 시각/확인 근거를 남깁니다.
5. 접근성/링크/키 유출 검수를 다시 하고 main에 푸시합니다. 같은 앱 URL을 유지하고 이후 변경 시 구 버전/변경 내용/실제 시행일을 보관합니다.
6. 실제 Android 앱 내 방침 접근 경로 및 Google Play 데이터 보안 신고와 일치하는지 별도로 확인합니다. 이 저장소 작업은 Android 앱을 수정하지 않습니다.

## 공개 정보 검수

공개 저장소에는 정책 사이트의 허용된 HTML/CSS/SVG/문서/검사 스크립트만 넣습니다. 앱 비공개 소스, APK, 실제 인증정보, 서명 키, 기기 백업, 이동 기록, 원본 SDK/소스 사본, 사용자 로그를 복사하지 않습니다. `noindex`, 숨김 파일, robots.txt는 비밀 보호 장치가 아닙니다. GitHub Pages와 GitHub 저장소 모두의 공개 범위를 검토하세요.

이 사이트에는 자체 추적 스크립트가 없습니다. 다만 호스팅 제공자 GitHub는 서비스 제공 과정의 접속/IP 정보를 처리할 수 있습니다. ‘접속 데이터가 전혀 처리되지 않는다’고 주장하지 않습니다. 자세한 내용은 [GitHub 개인정보 안내](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)를 확인하세요.
