# ieoduda Frontend

Next.js와 TypeScript를 기반으로 구성한 프론트엔드 프로젝트입니다.

## 프로젝트 초기 설정

다음 개발 환경을 적용했습니다.

* Next.js
* React
* TypeScript
* App Router
* Tailwind CSS
* ESLint
* npm

`create-next-app`으로 프로젝트를 생성한 후, 실제 프로젝트에서 사용하지 않는 기본 예제 화면과 이미지 파일과 예제 코드를 제거했습니다.

## 정적 파일 안내

Next.js가 기본으로 생성한 `public` 폴더 내부의 예제 이미지 파일은 모두 삭제했습니다.

Git은 빈 폴더를 추적하지 않기 때문에 저장소를 clone한 후 `public` 폴더가 보이지 않을 수 있습니다. 이미지, 아이콘, 폰트 등의 정적 파일이 필요한 경우 프로젝트에 `public` 폴더를 새로 생성해 사용해야 합니다.

Next.js가 기본으로 생성한 `app` 폴더 내부의 `globals.css`, `layout.tsx`, `page.tsx` 파일의 예제 코드는 모두 초기 설정 코드로 변경했습니다.


## 프로젝트 실행

저장소를 clone한 후 패키지를 설치합니다.

```bash
npm install
```

개발 서버를 실행합니다.

```bash
npm run dev
```

코드 검사를 실행합니다.

```bash
npm run lint
```

배포용 빌드를 검사합니다.

```bash
npm run build
```
