// import { useSearchParams } from 'react-router-dom'
// import { useEffect, useState } from 'react'

const Footer = () => {

    return (
        <div className="p-5 h-25 fixed-bottom bg-primary text-white">

            <div className="container">
                <div className="row">

                    <div className="col d-flex justify-content-end align-items-start px-5">
                        <img style={{width:250}} src="/assets/dandelion-logo.svg"></img>
                    </div>

                    <div className="col p-0">
                        <div className="container p-0">
                            <div className="row ">
                                <a className="text-white" href=""><b>Dandelion-lite goverance</b></a>
                            </div>                            
                            <div className="row">
                                <a className="text-white" href="https://milestones.projectcatalyst.io/projects/1300078">Catalyst milestones</a>
                            </div>
                            <div className="row">
                                <a className="text-white" href="https://www.notion.so/gimbalabs/Getting-Started-930b4f8d049b44ff964a0f7bd174d413">Gimbalabs Notion</a>
                            </div>
                            <div className="row">
                                <a className="text-white" href="https://github.com/GameChangerFinance/dandelion-lite">Github</a>
                            </div>
                            <div className="row">
                                <a className="text-white" href="https://discord.gg/nxf55MMhSp">Gimbalabs Discord</a>
                            </div>
                            <div className="row">
                                <a className="text-white" href="https://discord.gg/PqXD4dbTfH">Gamechanger wallet Discord</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Footer;
