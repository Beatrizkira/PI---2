'use client';

import Link from 'next/link';
import { useState } from 'react';

const AccountTabs = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="account-tab-area-start rts-section-gap">
      <div className="container-2">
        <div className="row">
          <div className="col-lg-3">
            <div className="nav accout-dashborard-nav flex-column nav-pills me-3" role="tablist">
              <button
                className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <i className="fa-regular fa-chart-line"></i> Painel
              </button>
              <button
                className={`nav-link ${activeTab === 'account' ? 'active' : ''}`}
                onClick={() => setActiveTab('account')}
              >
                <i className="fa-regular fa-user"></i> Dados da conta
              </button>
              <button className="nav-link">
                <Link href="/login">
                  <i className="fa-light fa-right-from-bracket"></i> Sair
                </Link>
              </button>
            </div>
          </div>
          <div className="col-lg-9 pl--50 pl_md--10 pl_sm--10 pt_md--30 pt_sm--30">
            <div className="tab-content">

              {activeTab === 'dashboard' && (
                <div className="dashboard-account-area">
                  <h2 className="title">
                    Olá! (Não é você?) <Link href="/login">Sair.</Link>
                  </h2>
                  <p className="disc">
                    No painel da sua conta você pode alterar sua senha e os dados da conta.
                  </p>
                </div>
              )}

              {activeTab === 'account' && (
                <form className="account-details-area">
                  <h2 className="title">Dados da conta</h2>
                  <div className="input-half-area">
                    <div className="single-input">
                      <input type="text" placeholder="Nome" />
                    </div>
                    <div className="single-input">
                      <input type="text" placeholder="Sobrenome" />
                    </div>
                  </div>
                  <input type="text" placeholder="Nome de exibição" required />
                  <input type="email" placeholder="E-mail *" required />
                  <input type="password" placeholder="Senha atual *" required />
                  <input type="password" placeholder="Nova senha *" />
                  <input type="password" placeholder="Confirmar nova senha *" />
                  <button className="rts-btn btn-primary">Salvar alterações</button>
                </form>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTabs;