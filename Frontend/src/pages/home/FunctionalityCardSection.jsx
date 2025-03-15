import PackageIcon from './../../assets/package.svg'
import SecureIcon from './../../assets/secure.svg'
import QualityIcon from './../../assets/quality.svg'
import SavingsIcon from './../../assets/savings.svg'
import GiftIcon from './../../assets/gift.svg'

export default function FunctionalityCardSection() {
    return (
        <>
            <section className="py-5">
                <div className="container-lg">
                    <div className="row row-cols-1 row-cols-sm-3 row-cols-lg-5">
                        <div className="col">
                            <div className="card mb-3 border border-dark-subtle p-3">
                                <div className="text-dark mb-3">
                                    <img src={PackageIcon} alt="package" width={32} height={32} />
                                </div>
                                <div className="card-body p-0">
                                    <h5>Free delivery</h5>
                                    <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipi elit.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card mb-3 border border-dark-subtle p-3">
                                <div className="text-dark mb-3">
                                    <img src={SecureIcon} alt="secure" width={32} height={32} />
                                </div>
                                <div className="card-body p-0">
                                    <h5>100% secure payment</h5>
                                    <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipi elit.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card mb-3 border border-dark-subtle p-3">
                                <div className="text-dark mb-3">
                                    <img src={QualityIcon} alt="quality" width={32} height={32} />
                                </div>
                                <div className="card-body p-0">
                                    <h5>Quality guarantee</h5>
                                    <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipi elit.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card mb-3 border border-dark-subtle p-3">
                                <div className="text-dark mb-3">
                                    <img src={SavingsIcon} alt="savings" width={32} height={32} />
                                </div>
                                <div className="card-body p-0">
                                    <h5>guaranteed savings</h5>
                                    <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipi elit.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card mb-3 border border-dark-subtle p-3">
                                <div className="text-dark mb-3">
                                    <img src={GiftIcon} alt="offers" width={32} height={32} />
                                </div>
                                <div className="card-body p-0">
                                    <h5>Daily offers</h5>
                                    <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipi elit.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}