# ieoduda-Frontend

# 📌 Frontend Git Convention

프론트엔드 프로젝트의 일관된 협업을 위한 GitHub 작성 규칙입니다.
Issue, Commit, Pull Request 작성 시 아래 규칙을 준수합니다.

---

## 1. Label Convention

| Label      | 설명                                    |
| ---------- | ------------------------------------- |
| `Feat`     | 새로운 기능 추가 또는 기존 기능 개선과 관련된 변경         |
| `Fix`      | 버그 수정 또는 오류 해결과 관련된 변경                |
| `Refactor` | 기능에 영향을 주지 않는 코드 구조 및 내부 설계 변경        |
| `Design`   | UI/UX 또는 디자인 관련 변경                    |
| `Chore`    | 빌드 시스템, 라이브러리 업데이트, 코드 스타일 등 내부 관리 작업 |
| `Setting`  | 프로젝트 환경 설정 또는 구성 파일 변경                |
| `Comment`  | 주석 추가·수정 또는 로그 출력 관련 변경               |
| `Docs`     | README 등 문서 추가 및 수정                   |
| `Test`     | 테스트 코드 추가 및 수정                        |

---

# 💬 Commit Convention

## 1. Commit 제목 규칙

### 형식

```text
[{Label}/{Issue 번호}] {Label}: {작업 내용}
```

## 2. Commit 작성 기준

* 하나의 Commit에는 하나의 작업 목적만 포함합니다.
* 작업 내용을 짧고 명확하게 작성합니다.
* 제목에 연관된 Issue 번호를 작성합니다.
* Label은 위에서 정의한 이름과 대소문자를 동일하게 작성합니다.

---

# 📝 Issue Convention

## 1. Issue 제목 규칙

### 형식

```text
[{Label}] {목표 한 줄}
```

### 예시

```text
[Design] 디자인 토큰 및 Pretendard 적용
[Chore] Tailwind 종속성 추가
[Comment] Admin 페이지 주석 추가
[Feat] 로그인 페이지 구현
[Fix] 모바일 환경의 레이아웃 오류 수정
```

---

## 2. Issue 본문 템플릿

```markdown
## 목적

이 이슈에서 해결하려는 목표를 작성합니다.

## 범위

### 포함

- 작업에 포함되는 내용 1
- 작업에 포함되는 내용 2

### 제외

- 작업에 포함되지 않는 내용 1
- 작업에 포함되지 않는 내용 2

## 작업 내용

- [ ] 작업 1
- [ ] 작업 2
- [ ] 작업 3

## 완료 조건

- [ ] 완료 조건 1
- [ ] 완료 조건 2
- [ ] 완료 조건 3
```

---

## 3. Issue 작성 기준

### 목적

해당 작업을 진행하는 이유를 한두 줄로 작성합니다.

```markdown
## 목적

공통 색상 및 타이포그래피 토큰을 `packages/ui`에 정의하고,
프론트엔드 전체에 `Pretendard`를 적용합니다.
```

### 범위

작업 범위가 불필요하게 커지는 것을 방지하기 위해 포함 범위와 제외 범위를 반드시 작성합니다.

```markdown
## 범위

### 포함

- color 및 typography 토큰 정의
- `tokens.css`, `fonts.css` 작성
- home/admin root 레벨 폰트 적용

### 제외

- Button, Input 등 UI 컴포넌트 구현
- 페이지 단위 UI 조립
- 기존 페이지 디자인 수정
```

### 작업 내용

해당 Issue에서 실제로 수행해야 하는 작업을 체크리스트로 작성합니다.

```markdown
## 작업 내용

- [ ] `colors.ts` 정의
- [ ] `typography.ts` 정의
- [ ] `tokens.css` 작성
- [ ] `fonts.css` 작성
- [ ] `apps/home/root.tsx`에 폰트 적용
- [ ] `apps/admin/root.tsx`에 폰트 적용
```

### 완료 조건

Issue를 종료할 수 있는 객관적인 판단 기준을 작성합니다.

```markdown
## 완료 조건

- [ ] `packages/ui`에서 공통 토큰을 import할 수 있다
- [ ] Home과 Admin 앱에서 Pretendard가 정상적으로 적용된다
- [ ] 기존 스타일이 깨지지 않는다
- [ ] 개발 서버가 오류 없이 실행된다
```

---

## 4. Issue 작성 예시

```markdown
# [Design] 디자인 토큰 및 Pretendard 적용

## 목적

공통 색상 및 타이포그래피 토큰을 `packages/ui`에 정의하고,
프론트엔드 전체에 `Pretendard`를 적용합니다.

## 범위

### 포함

- color 및 typography 토큰 정의
- `tokens.css`, `fonts.css` 작성
- Home 및 Admin 앱의 root 레벨 폰트 적용

### 제외

- Button, Input 등 공통 UI 컴포넌트 구현
- 페이지 단위 UI 조립
- 기존 페이지 레이아웃 수정

## 작업 내용

- [ ] `colors.ts` 정의
- [ ] `typography.ts` 정의
- [ ] `tokens.css` 작성
- [ ] `fonts.css` 작성
- [ ] Home 앱에 폰트 적용
- [ ] Admin 앱에 폰트 적용

## 완료 조건

- [ ] `packages/ui`에서 공통 토큰을 import할 수 있다
- [ ] Home과 Admin 앱에서 Pretendard가 정상적으로 적용된다
- [ ] 기존 스타일이 깨지지 않는다
- [ ] 개발 서버가 오류 없이 실행된다
```

---

# 🔀 Pull Request Convention

## 1. PR 제목 규칙

### 형식

```text
[{Label}/{Issue 번호}] {작업 요약}
```

---

## 2. PR 본문 템플릿

```markdown
## 연관 Issue

- Closes #{Issue 번호}

## 요약

이 PR에서 변경한 내용을 간단하게 설명합니다.

## 변경 사항

- 변경 사항 1
- 변경 사항 2
- 변경 사항 3

## 범위

### 포함

- 작업에 포함된 내용 1
- 작업에 포함된 내용 2

### 제외

- 작업에 포함되지 않은 내용 1
- 작업에 포함되지 않은 내용 2

## 스크린샷 / 미리 보기

- UI 변경 전후 이미지 또는 실행 화면을 첨부합니다.
```

---

## 3. PR 작성 기준

### 연관 Issue

PR과 관련된 Issue 번호를 작성합니다.

```markdown
## 연관 Issue

- Closes #1
```

PR이 Merge되면 연결된 Issue가 자동으로 종료됩니다.

### 요약

PR의 핵심 목적과 변경 내용을 짧게 작성합니다.

```markdown
## 요약

`packages/ui`에 공통 프리미티브 컴포넌트를 추가하고,
Home과 Admin 앱에서 재사용할 수 있도록 export 구조를 정리했습니다.
```

### 변경 사항

실제로 변경된 내용을 사실에 기반하여 작성합니다.

```markdown
## 변경 사항

- CTA Button 컴포넌트 추가
- TextInput 및 PasswordInput 구현
- SectionHeader 컴포넌트 추가
- UI Package export 구조 정리
```

### 범위

PR에서 처리한 범위와 처리하지 않은 범위를 명확하게 작성합니다.

```markdown
## 범위

### 포함

- 공통 프리미티브 컴포넌트 구현
- 기본 Props 및 Variant 정의
- 공통 컴포넌트 export 설정

### 제외

- Navbar와 Footer 등 레이아웃 컴포넌트
- 페이지 단위 UI 조립
- Form Validation 로직
```

### 스크린샷 / 미리 보기

UI가 변경되었다면 변경 전후 화면이나 실행 결과를 첨부합니다.

```markdown
## 스크린샷 / 미리 보기

### Before

변경 전 이미지를 첨부합니다.

### After

변경 후 이미지를 첨부합니다.
```

---

## 4. PR 작성 예시

```markdown
# [Feat/#4] 공통 Input 컴포넌트 구현

## 연관 Issue

- Closes #4

## 요약

`packages/ui`에 공통 입력 컴포넌트를 추가하고,
Home과 Admin 앱에서 재사용할 수 있도록 export를 정리했습니다.

## 변경 사항

- TextInput 컴포넌트 구현
- PasswordInput 컴포넌트 구현
- 입력창 상태별 스타일 추가
- UI Package export 구조 정리

## 범위

### 포함

- TextInput 컴포넌트 구현
- PasswordInput 컴포넌트 구현
- 기본 Props 및 입력 상태 정의

### 제외

- Form Validation 로직
- 로그인 API 연동
- 페이지 단위 UI 조립
- 에러 메시지 정책 정의

## 스크린샷 / 미리 보기

- before/after 이미지 또는 캡처 첨부
```
