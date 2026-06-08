# Конспект: React Forms — что где используется

## Как открыть формы в проекте

Запусти приложение (`npm run dev`) и перейди по адресу:

```
http://localhost:5173/forms
```

На странице две кнопки: **Open Uncontrolled Form** и **Open Hook Form**.
Каждая открывает соответствующую форму внутри модального окна.

---

## Структура новых файлов

```
src/
├── components/
│   ├── Modal/
│   │   └── Modal.tsx          — универсальное модальное окно (React Portal)
│   └── PasswordStrength.tsx   — индикатор сложности пароля
├── data/
│   └── countries.ts           — список стран (41 страна, хранится в Redux)
├── features/
│   └── formsSlice.ts          — Redux-срез для хранения отправленных форм
├── forms/
│   ├── UncontrolledForm.tsx   — форма на неуправляемых компонентах (useRef)
│   └── HookForm.tsx           — форма на React Hook Form
├── pages/
│   └── FormsPage.tsx          — страница /forms: кнопки + список отправок
└── utils/
    ├── imageUtils.ts          — конвертация файла в base64
    └── validation.ts          — Yup-схема валидации (общая для обеих форм)
```

---

## Подробно о каждом файле

### `src/pages/FormsPage.tsx`
**Что делает:** Страница, доступная по маршруту `/forms`.

**Содержит:**
- Кнопки "Open Uncontrolled Form" и "Open Hook Form" — открывают соответствующий Modal.
- Список всех отправленных форм из Redux-стора (`selectSubmissions`).
- У каждой новой отправки появляется зелёный бейдж **NEW**, который автоматически исчезает через 3 секунды (через `setTimeout` + `dispatch(markRead(id))`).

**Где зарегистрирована:**
`src/App.tsx` — добавлен маршрут `<Route path="/forms" element={<FormsPage />} />`

---

### `src/components/Modal/Modal.tsx`
**Что делает:** Универсальное модальное окно через `ReactDOM.createPortal`.

**Как работает:**
- Рендерит содержимое прямо в `document.body` через `createPortal`, минуя иерархию DOM.
- При открытии автоматически переводит фокус на первый интерактивный элемент внутри (`button`, `input`, и т.д.) — это важно для доступности.
- Закрывается по клавише `Escape` (слушатель на `document`).
- Закрывается по клику на затемнённый фон (backdrop); клик внутри окна не закрывает его (`stopPropagation`).
- Имеет атрибуты доступности: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`.

**Где используется:**
`src/pages/FormsPage.tsx` — два раза, по одному на каждую форму.

---

### `src/forms/UncontrolledForm.tsx`
**Что делает:** Форма на **неуправляемых компонентах** — значения полей читаются через `useRef`, а не через React-стейт.

**Поля:** имя, возраст, email, пол (radio), пароль, подтверждение пароля, страна (datalist), изображение (file), согласие с условиями (checkbox).

**Как работает:**
- Каждое поле прикреплено через `ref={nameRef}` и т.д.
- При нажатии Submit запускается `handleSubmit`, который вручную читает значения через `.current?.value`.
- Валидация — только **при отправке** (`abortEarly: false` — показывает сразу все ошибки).
- Если есть ошибки — `setErrors(fieldErrors)`, форма остаётся открытой.
- Если всё ок — конвертирует файл в base64, отправляет в Redux, вызывает `onClose()`.
- Функция `getGender()` проверяет, какой radio отмечен; если ни один — возвращает `''`, и валидация падает с ошибкой "Select a gender".

**Где используется:**
`src/pages/FormsPage.tsx` — внутри первого `<Modal>`.

---

### `src/forms/HookForm.tsx`
**Что делает:** Та же форма, но реализована через библиотеку **React Hook Form**.

**Как работает:**
- `useForm({ resolver: yupResolver(formSchema), mode: 'onChange' })` — реактивная валидация, которая запускается при каждом изменении поля.
- Кнопка Submit **disabled**, пока форма невалидна (`disabled={!isValid}`).
- Ошибки показываются сразу по мере ввода, без необходимости нажимать Submit.
- `register('name')`, `register('age', { valueAsNumber: true })` и т.д. — подключение полей к RHF.
- `watch('password')` — следит за полем пароля в реальном времени, передаёт значение в `PasswordStrength`.
- При успешной отправке — то же, что и UncontrolledForm: base64, Redux, закрытие.

**Где используется:**
`src/pages/FormsPage.tsx` — внутри второго `<Modal>`.

---

### `src/utils/validation.ts`
**Что делает:** Единая Yup-схема `formSchema`, которую используют обе формы.

**Правила валидации:**
| Поле | Правило |
|------|---------|
| `name` | Обязательное, первая буква заглавная |
| `age` | Число, не отрицательное |
| `email` | Ручная проверка: есть `@`, есть непустая часть до `@`, домен содержит `.` — **без regex** |
| `gender` | Одно из `['male', 'female', 'other']`, обязательное |
| `terms` | Должен быть `true` |
| `password` | Обязательный, минимум 8 символов |
| `confirmPassword` | Должен совпадать с `password` через `yup.ref('password')` |
| `image` | Только PNG/JPEG, максимум 5 MB; принимает `File` или `FileList` |
| `country` | Должна быть в списке стран из Redux-контекста (`context.countries`) |

**Экспортирует:** `formSchema` и тип `FormValues`.

**Где используется:**
- `src/forms/UncontrolledForm.tsx` — вызов `formSchema.validate(rawData, { abortEarly: false, context: { countries } })`
- `src/forms/HookForm.tsx` — `yupResolver(formSchema)` в конфиге `useForm`

---

### `src/features/formsSlice.ts`
**Что делает:** Redux Toolkit срез для хранения всех отправленных форм.

**State:**
```typescript
{
  submissions: FormSubmission[]  // массив отправок
  countries: string[]            // список стран из data/countries.ts
}
```

**Actions:**
| Action | Что делает |
|--------|-----------|
| `addSubmission(data)` | Добавляет отправку в начало массива, присваивает `id` (crypto.randomUUID) и `isNew: true` |
| `markRead(id)` | Устанавливает `isNew: false` для указанного id |
| `clearSubmissions()` | Очищает весь массив (используется в тестах) |

**Selectors:** `selectSubmissions`, `selectCountries`

**Где используется:**
- `src/store.ts` — добавлен в Redux store как `forms: formsReducer`
- `src/forms/UncontrolledForm.tsx` и `HookForm.tsx` — `dispatch(addSubmission(...))`
- `src/pages/FormsPage.tsx` — `useSelector(selectSubmissions)`, `dispatch(markRead(id))`

---

### `src/components/PasswordStrength.tsx`
**Что делает:** Визуальный индикатор сложности пароля.

**Показывает 4 критерия:**
- Минимум 8 символов
- Есть заглавная буква
- Есть цифра
- Есть спецсимвол

Каждый критерий — зелёная галочка (выполнен) или серый кружок (нет).  
**Не блокирует отправку** — только информирует пользователя.

**Где используется:**
- `src/forms/UncontrolledForm.tsx` — `<PasswordStrength password={passwordValue} />`
- `src/forms/HookForm.tsx` — `<PasswordStrength password={passwordValue} />`

---

### `src/utils/imageUtils.ts`
**Что делает:** Одна функция `fileToBase64(file: File): Promise<string>`.

**Как работает:**
Использует `FileReader.readAsDataURL()` — стандартный браузерный API. Возвращает строку вида `data:image/png;base64,...`.

**Зачем нужна:** Браузер не может хранить объект `File` в Redux (он нестериализуем). Поэтому при успешной отправке файл конвертируется в строку base64 и уже она сохраняется в стор.

**Где используется:**
- `src/forms/UncontrolledForm.tsx` — `const image = await fileToBase64(file)`
- `src/forms/HookForm.tsx` — то же самое

---

### `src/data/countries.ts`
**Что делает:** Экспортирует массив из 41 страны (`COUNTRIES: string[]`).

**Где используется:**
- `src/features/formsSlice.ts` — помещается в `initialState.countries`
- Из Redux читается через `selectCountries` в обеих формах и передаётся в `<datalist>` для автодополнения и в `formSchema.validate({ context: { countries } })` для валидации

---

## Цепочка данных при отправке формы

```
Пользователь заполняет форму
        ↓
Валидация через Yup (formSchema)
        ↓
fileToBase64(file)  →  строка base64
        ↓
dispatch(addSubmission({ ...data, image: base64 }))
        ↓
Redux formsSlice  →  submissions[]
        ↓
FormsPage  →  useSelector(selectSubmissions)  →  рендер карточек
        ↓
setTimeout 3 сек  →  dispatch(markRead(id))  →  бейдж NEW исчезает
```

---

## Зависимости, добавленные в этой задаче

| Пакет | Зачем |
|-------|-------|
| `react-hook-form` | Управляет состоянием формы, валидацией и ошибками в HookForm |
| `yup` | Декларативные схемы валидации, общие для обеих форм |
| `@hookform/resolvers` | Связывает Yup-схему с React Hook Form (`yupResolver`) |
