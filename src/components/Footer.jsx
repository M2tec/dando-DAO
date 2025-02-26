// import { useSearchParams } from 'react-router-dom'
// import { useEffect, useState } from 'react'

const Footer = () => {

    return (
        <div class="p-5 h-25 fixed-bottom bg-primary text-white">

            <div class="container">
                <div class="row">

                    <div class="col d-flex justify-content-end align-items-start">
                        <img style={{width:250}} src="/dandelion-logo.svg"></img>
                    </div>

                    <div class="col p-0">
                        <div class="container p-0">
                            <div class="row">
                                <a href="#" className="underline"><b>Dandelion-lite goverance</b></a>
                            </div>                            
                            <div class="row">
                                <a href="#" className="underline">Catalyst milestones</a>
                            </div>
                            <div class="row">
                                <a href="#" className="underline">Gimbalabs Motion</a>
                            </div>
                            <div class="row">
                                <a href="#" className="underline">Github</a>
                            </div>
                            <div class="row">
                                <a href="#" className="underline">Gimbalabs Discord</a>
                            </div>
                            <div class="row">
                                <a href="#" className="underline">Gamechanger wallet Discord</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Footer;
