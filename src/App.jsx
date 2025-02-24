import React, { useState, useCallback } from "react";
import { Transforms, createEditor, Editor } from "slate";
import { Slate, Editable, withReact, useSlateStatic,
  useReadOnly,
  ReactEditor} from "slate-react";

const App = () => {
  const [editor] = useState(() => withReact(createEditor()));

  const [value, setValue] = useState([
    { type: "paragraph", children: [{ text: "Écrivez ici..." }] },
    
  ]);

  const handleChange = useCallback((newValue) => {
    setValue(newValue);
  }, []);

  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      case 'back':
        return <CodeElement2 {...props} />
      case 'choix':
        return <Choix {...props} />
      case 'choix1':
        return <Choix1 {...props} />
      case 'image':
        return <Image {...props} />
      case 'math':
        return <Math {...props} />
      default:
        return <DefaultElement {...props} />
      
    }
  }, [])


  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, [])


  let dd = <math>
  <mfrac >
      <mfrac>
          <mi id="oo" >s</mi>
          <mi id = 'td'>w</mi>
          
      </mfrac>
      <mfrac>
          <mi>2</mi>
          <mi>b</mi>
      </mfrac>
  </mfrac>
  

</math>
  function ajouterExpression(){
  
    editor.insertNodes({ type: "math", children: [{ text: "" }], expression: dd})
  }
  function ajouterImage(){          
    Transforms.insertNodes(editor, { type: "image", children: [{ text: "" }],id:'1'});
  }

  function ajouterChoixImage(){
    editor.insertNode({ type: "choix1", children: [ { type: "image", children: [{ text: "" }],id:'1'}], checked: true, id:'1'})
  }

  function ajouterChoix(){
    editor.insertNode({ type: "code", children: [{ text: "Écrivez ici..." }]})
  }


  return (
    <div style={{ minWidth:"600px", maxWidth: "900px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>PROJET QCM</h2>
      
      <Slate editor={editor} initialValue={value} onChange={handleChange}>
        <button onClick={() =>{ajouterExpression()}}>Expression</button>
        <button onClick={() =>{ajouterImage()}}>Image</button>
        <button onClick={() =>{ajouterChoixImage()}}>Choix IMG</button>
        <button onClick={() =>{ajouterChoix()}}>Choix</button>
        
        
        
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}

          placeholder="Commencez à écrire..."
          style={{ minHeight: "1500px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}

          onKeyDown={event => {
            if (event.key === '&') {
              
              event.preventDefault()
              
              editor.insertNode({ type: "back", children: [{ text: "Écrivez ici..." }]})
            }
            if(event.key == '*'){
        
              event.preventDefault()
              Editor.addMark(editor, 'bolsd', true)
            }
            if(event.key == '#'){
              event.preventDefault()
              editor.insertNode({ type: "choix1", children: [ { type: "image", children: [{ text: "" }],id:'1'}], checked: true, id:'1'})
            }
            if((event.key == ')')){
              event.preventDefault()
              
              Transforms.insertNodes(editor, { type: "image", children: [{ text: "" }],id:'1'});
              
            }
            if((event.key == '+')){
              event.preventDefault()
              
              Editor.addMark(editor, 'bold', true)
              
            }

          }}
        />
      </Slate>
    </div>
  );
};


const CodeElement = props => {
  return (
    <pre {...props.attributes}>
      <input type="checkbox" name="1" />
      <span>{props.children}</span>
    </pre>
  )
}
const DefaultElement = props => {
  return <p {...props.attributes}>{props.children}</p>
}

const Leaf = (props) => {

  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
    >
      {props.children}
    </span>
  )
}

const CodeElement2 = props => {
  return (
    <div {...props.attributes} style={{backgroundColor:'red', borderRadius:'2px', marginBottom:'10px'}}>
      <input type="checkbox" name="1" />
      <span>{props.children}</span>
    </div>
  )
}

const Choix = props => {
  return (
    <pre {...props.attributes} style={{backgroundColor:'green', borderRadius:'2px', marginBottom:'10px'}}>
      <input type="checkbox" name="1" checked={true} />
      <img src="https://www.soprinter.com/content/cache/online/620x1000/54bf71e5f3147_taille-faible-agrandissement-impression-mauvaise-qualit.jpg" />
      <span>{props.element.id}</span>
      <span contentEditable={false}>{props.children}</span>
    </pre>
  )
}




const Image = ({ attributes, children, element }) => {
  return (
    <span {...attributes}  style={{ display: "inline-flex", alignItems: "center" }}>
      <img src="https://www.soprinter.com/content/cache/online/620x1000/54bf71e5f3147_taille-faible-agrandissement-impression-mauvaise-qualit.jpg" alt="ssss" style={{ maxWidth: "50px", height: "auto", margin: "0 5px" }} />
      {...children}
    </span>
  )
}


const Choix1 = ( {attributes, children, element} )=> {

  const editor = useSlateStatic()
  
  return (
    <div {...attributes} style={
         {
            //backgroundColor:'red', 
            borderRadius:'2px', 
            marginBottom:'10px'

          }
        }
      >
      <span
        contentEditable={false}
        style={
          {
            marginRight: '0.75em'
          }
        }
      >
        
        <input 
          type="checkbox"
          checked={element.checked}
          onChange={(event) => {
            const path = ReactEditor.findPath(editor, element);
            Transforms.setNodes(
              editor,
              { checked: event.target.checked },
              { at: path }
            );
            
          }}
        />
        
      </span>

      <span>{children}</span>
    </div>
  )
}


const Math = props => {
  return (
    <pre {...props.attributes} >
      <span>{props.element.expression}</span>
      <span contentEditable={false}>{props.children}</span>
    </pre>
  )
}









export default App;