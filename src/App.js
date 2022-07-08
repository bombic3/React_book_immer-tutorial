import { useRef, useCallback, useState } from 'react';
import produce from 'immer';

/*
### App 컴포넌트에 immer 적용하기
- immer를 사용하여 컴포넌트 상태를 작성할 때는 객체 안에 있는 값을 직접 수정하거나
    - 배열에 직접적인 변화를 일으키는 push, splice 등의 함수 사용해도 무방
    - 때문에 불변성 유지에 익숙하지 않아도 자바스크립트에 익숙하다면 컴포넌트 상태에 원하는 변화 쉽게 반영 시킬 수 있음
- onRemove의 경우 filter 사용시 코드가 더 깔끔 → 굳이 immer 적용할 필요X
- immer는 불변성을 유지하는 코드가 복잡할 때만 사용
 */

/*
  immer 와 useState의 함수형 업데이트 함께 활용하여 App 컴포넌트 수정
*/

// immer를 사용하지 않고 불변성 유지
const App = () => {
  const nextId = useRef(1);
  const [form, setForm] = useState({ name: '', username: '' });
  const [data, setData] = useState({
    array: [],
    uselessValue: null
  });

  // input 수정을 위한 함수
  const onChange = useCallback( e => {
      const { name, value } = e.target;
      setForm(
        produce (draft => {
          draft[name] = value;
        })
        // ...form,
        // [name]: [value]
      );
    },[]);

  // form 등록을 위한 함수
  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      const info = {
        id: nextId.current,
        name: form.name,
        username: form.username
      };

      // array에 새 항목 등록
      setData(
        produce(draft => {
          draft.array.push(info);
        })
        // ...data,
        // array: data.array.concat(info)
      );

      // form 초기화
      setForm({
        name: '',
        username: ''
      });
      nextId.current += 1;
    },
    [form.name, form.username]
  );

  // 항목을 삭제하는 함수
  const onRemove = useCallback(
    id => {
      setData(
        produce(draft => {
          draft.array.splice(draft.array.findIndex(info => info.id === id), 1);
        })
        // ...data,
        // array: data.array.filter(info => info.id !== id)
      );
    },
    []
  );

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="username"
          placeholder="아이디"
          value={form.username}
          onChange={onChange}
        />
        <input
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={onChange}
        />
        <button type="submit">등록</button>
      </form>
      <div>
        <ul>
          {data.array.map(info => (
            <li key={info.id} onClick={() => onRemove(info.id)}>
              {info.username} ({info.name})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
