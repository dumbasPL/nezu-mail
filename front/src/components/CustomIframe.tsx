import React, { Component } from 'react'

interface IProps {
  html: string;
  title: string;
}

export default class CustomIframe extends Component<IProps, unknown> {

  constructor(props: any) {
    super(props);
    
    this.writeHTML = this.writeHTML.bind(this)
  }

  writeHTML(frame: HTMLIFrameElement){

    if(!frame) {
      return
    }

    let doc = frame.contentDocument!;

    doc.open()
    doc.write(this.props.html)
    doc.close()

    frame.style.width = '100%';
    frame.style.height = `${frame.contentWindow!.document.body.scrollHeight}px`;
  }

  render(){
    return (
      <iframe src='about:blank' frameBorder='0' ref={this.writeHTML} title={this.props.title}></iframe>
    )
  }
}