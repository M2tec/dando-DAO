// import { useSearchParams } from 'react-router-dom'
// import { useEffect, useState } from 'react'

const Footer = () => {

    return (
        <div class="p-5 h-25 fixed-bottom bg-primary text-white">

            <div class="container">
                <div class="row">

                    <div class="col d-flex justify-content-end align-items-start px-5">
                        <img style={{width:250}} src="/dandelion-logo.svg"></img>
                    </div>

                    <div class="col p-0">
                        <div class="container p-0">
                            <div class="row ">
                                <a class="text-white" href=""><b>Dandelion-lite goverance</b></a>
                            </div>                            
                            <div class="row">
                                <a class="text-white" href="https://milestones.projectcatalyst.io/projects/1300078">Catalyst milestones</a>
                            </div>
                            <div class="row">
                                <a class="text-white" href="https://www.notion.so/gimbalabs/Getting-Started-930b4f8d049b44ff964a0f7bd174d413">Gimbalabs Notion</a>
                            </div>
                            <div class="row">
                                <a class="text-white" href="https://github.com/GameChangerFinance/dandelion-lite">Github</a>
                            </div>
                            <div class="row">
                                <a class="text-white" href="https://discord.gg/nxf55MMhSp">Gimbalabs Discord</a>
                            </div>
                            <div class="row">
                                <a class="text-white" href="https://discord.gg/PqXD4dbTfH">Gamechanger wallet Discord</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Footer;
